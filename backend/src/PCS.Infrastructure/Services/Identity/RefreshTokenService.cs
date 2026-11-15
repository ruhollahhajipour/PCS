using System.Security.Cryptography;
using System.Text;

using Microsoft.EntityFrameworkCore;

using PCS.Application.Common.Auditing;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;
using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Services.Identity;

public sealed class RefreshTokenService : IRefreshTokenService
{
    private const string RotatedReason = "rotated";
    private const int MaxTokenLength = 256;

    private readonly PCSDbContext _dbContext;
    private readonly IAuditContext? _auditContext;
    private readonly IAuditService? _auditService;
    private readonly RefreshTokenOptions _options;
    private readonly TimeProvider _time;

    public RefreshTokenService(
        PCSDbContext dbContext,
        IAuditContext? auditContext = null,
        IAuditService? auditService = null,
        RefreshTokenOptions? options = null,
        TimeProvider? timeProvider = null)
    {
        _dbContext = dbContext;
        _auditContext = auditContext;
        _auditService = auditService;
        _options = options ?? new RefreshTokenOptions();
        _time = timeProvider ?? TimeProvider.System;
    }

    private DateTime Now => _time.GetUtcNow().UtcDateTime;

    public async Task<IssuedRefreshToken> IssueAsync(
        Guid userId,
        Guid? companyId,
        CancellationToken cancellationToken = default)
    {
        // Housekeeping: drop this user's tokens that expired a month ago.
        DateTime cutoff = Now.AddDays(-30);
        await _dbContext.RefreshTokens
            .Where(x => x.UserId == userId && x.ExpiresAt < cutoff)
            .ExecuteDeleteAsync(cancellationToken);

        var (token, entity) = Create(userId, Guid.NewGuid(), companyId);

        _dbContext.RefreshTokens.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new IssuedRefreshToken(token, entity.ExpiresAt);
    }

    public async Task<RefreshRotation?> RotateAsync(
        string refreshToken,
        Guid? companyId,
        CancellationToken cancellationToken = default)
    {
        RefreshToken? current = await FindAsync(refreshToken, cancellationToken);

        if (current is null)
        {
            return null;
        }

        DateTime now = Now;

        if (current.RevokedAt.HasValue)
        {
            bool withinGrace =
                current.RevokedReason == RotatedReason &&
                now - current.RevokedAt.Value <= TimeSpan.FromSeconds(_options.ReuseGraceSeconds);

            if (!withinGrace)
            {
                // A token that was already used or revoked is being replayed:
                // treat the session as stolen.
                await RevokeFamilyAsync(
                    current.FamilyId,
                    "reuse_detected",
                    cancellationToken);

                // Only a replayed rotated token is a theft signal worth an audit
                // row; replaying an already logged-out token is routine.
                if (current.RevokedReason == RotatedReason)
                {
                    await RecordAsync(
                        AuditActions.RefreshTokenReuse,
                        current.UserId,
                        current.CompanyId,
                        "session_revoked",
                        cancellationToken);
                }
            }

            return null;
        }

        if (current.ExpiresAt <= now)
        {
            return null;
        }

        Guid? effectiveCompany = companyId ?? current.CompanyId;

        var (token, next) = Create(current.UserId, current.FamilyId, effectiveCompany);

        current.RevokedAt = now;
        current.RevokedReason = RotatedReason;
        current.ReplacedByTokenId = next.Id;

        _dbContext.RefreshTokens.Add(next);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new RefreshRotation(
            current.UserId,
            current.FamilyId,
            effectiveCompany,
            token,
            next.ExpiresAt);
    }

    public async Task RevokeByTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken = default)
    {
        RefreshToken? current = await FindAsync(refreshToken, cancellationToken);

        if (current is null)
        {
            return;
        }

        await RevokeFamilyAsync(current.FamilyId, "logout", cancellationToken);

        await RecordAsync(
            AuditActions.Logout,
            current.UserId,
            current.CompanyId,
            null,
            cancellationToken);
    }

    public async Task RevokeFamilyAsync(
        Guid familyId,
        string reason,
        CancellationToken cancellationToken = default)
    {
        DateTime now = Now;

        List<RefreshToken> active = await _dbContext.RefreshTokens
            .Where(x => x.FamilyId == familyId && x.RevokedAt == null)
            .ToListAsync(cancellationToken);

        foreach (RefreshToken token in active)
        {
            token.RevokedAt = now;
            token.RevokedReason = reason;
        }

        if (active.Count > 0)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<IReadOnlyList<SessionDto>> ListSessionsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        DateTime now = Now;

        List<RefreshToken> heads = await _dbContext.RefreshTokens
            .AsNoTracking()
            .Where(x => x.UserId == userId && x.RevokedAt == null && x.ExpiresAt > now)
            .ToListAsync(cancellationToken);

        Guid[] families = heads.Select(x => x.FamilyId).ToArray();

        // The first token of a family carries the start time and the login's
        // address and device.
        var firsts = (await _dbContext.RefreshTokens
                .AsNoTracking()
                .Where(x => families.Contains(x.FamilyId))
                .ToListAsync(cancellationToken))
            .GroupBy(x => x.FamilyId)
            .ToDictionary(g => g.Key, g => g.OrderBy(x => x.CreatedAt).First());

        return heads
            .OrderByDescending(x => x.CreatedAt)
            .Select(x =>
            {
                RefreshToken first = firsts[x.FamilyId];

                return new SessionDto
                {
                    Id = x.FamilyId,
                    StartedAt = first.CreatedAt,
                    LastUsedAt = x.CreatedAt,
                    ExpiresAt = x.ExpiresAt,
                    IpAddress = first.CreatedByIp,
                    UserAgent = first.UserAgent
                };
            })
            .ToList();
    }

    public async Task<bool> RevokeSessionAsync(
        Guid userId,
        Guid sessionId,
        CancellationToken cancellationToken = default)
    {
        bool owned = await _dbContext.RefreshTokens.AnyAsync(
            x => x.FamilyId == sessionId &&
                 x.UserId == userId &&
                 x.RevokedAt == null,
            cancellationToken);

        if (!owned)
        {
            return false;
        }

        await RevokeFamilyAsync(sessionId, "session_revoked", cancellationToken);

        await RecordAsync(
            AuditActions.SessionRevoked,
            userId,
            null,
            sessionId.ToString(),
            cancellationToken);

        return true;
    }

    public async Task RevokeAllForUserAsync(
        Guid userId,
        string reason,
        CancellationToken cancellationToken = default)
    {
        DateTime now = Now;

        List<RefreshToken> active = await _dbContext.RefreshTokens
            .Where(x => x.UserId == userId && x.RevokedAt == null)
            .ToListAsync(cancellationToken);

        foreach (RefreshToken token in active)
        {
            token.RevokedAt = now;
            token.RevokedReason = reason;
        }

        if (active.Count > 0)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    // ---------------------------------------------------------------

    private async Task<RefreshToken?> FindAsync(
        string refreshToken,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken) ||
            refreshToken.Length > MaxTokenLength)
        {
            return null;
        }

        string hash = Hash(refreshToken.Trim());

        return await _dbContext.RefreshTokens
            .SingleOrDefaultAsync(x => x.TokenHash == hash, cancellationToken);
    }

    private (string Token, RefreshToken Entity) Create(
        Guid userId,
        Guid familyId,
        Guid? companyId)
    {
        string token = Base64Url(RandomNumberGenerator.GetBytes(32));
        DateTime now = Now;

        return (token, new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FamilyId = familyId,
            CompanyId = companyId,
            TokenHash = Hash(token),
            CreatedAt = now,
            ExpiresAt = now.AddDays(_options.LifetimeDays),
            CreatedByIp = Truncate(_auditContext?.IpAddress, 64),
            UserAgent = Truncate(_auditContext?.UserAgent, 256)
        });
    }

    private Task RecordAsync(
        string action,
        Guid userId,
        Guid? companyId,
        string? details,
        CancellationToken cancellationToken) =>
        _auditService is null
            ? Task.CompletedTask
            : _auditService.RecordAsync(
                new AuditEvent(
                    AuditModules.Security,
                    "User",
                    userId.ToString(),
                    action,
                    userId,
                    null,
                    companyId,
                    details),
                cancellationToken);

    private static string Hash(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private static string Base64Url(byte[] bytes) =>
        Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');

    private static string? Truncate(string? value, int max) =>
        value is null || value.Length <= max ? value : value[..max];
}
