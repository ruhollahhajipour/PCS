using System.Security.Cryptography;
using System.Text;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using PCS.Application.Common.Auditing;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Services.Identity;

public sealed class AccountRecoveryService : IAccountRecoveryService
{
    private const string ResetPurpose = "PasswordReset";
    private const string VerifyPurpose = "EmailVerification";
    private const int MinPasswordLength = 8;

    // No 0/O/1/I/L: the code is read from an email and typed by a person.
    private const string Alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    private const int CodeLength = 8;

    private readonly PCSDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IEmailSender _emailSender;
    private readonly IRefreshTokenService _refreshTokens;
    private readonly IAuditService? _auditService;
    private readonly AccountRecoveryOptions _options;
    private readonly TimeProvider _time;
    private readonly ILogger<AccountRecoveryService>? _logger;

    public AccountRecoveryService(
        PCSDbContext dbContext,
        IPasswordHasher passwordHasher,
        IEmailSender emailSender,
        IRefreshTokenService refreshTokens,
        AccountRecoveryOptions? options = null,
        IAuditService? auditService = null,
        TimeProvider? timeProvider = null,
        ILogger<AccountRecoveryService>? logger = null)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _emailSender = emailSender;
        _refreshTokens = refreshTokens;
        _options = options ?? new AccountRecoveryOptions();
        _auditService = auditService;
        _time = timeProvider ?? TimeProvider.System;
        _logger = logger;
    }

    private DateTime Now => _time.GetUtcNow().UtcDateTime;

    public async Task RequestPasswordResetAsync(
        string identifier,
        CancellationToken cancellationToken = default)
    {
        User? user = await FindUserAsync(identifier, cancellationToken);

        if (user is null || string.IsNullOrWhiteSpace(user.Email))
        {
            return;
        }

        if (!await SendCodeAsync(
                user,
                ResetPurpose,
                "PCS password reset code",
                "Use this code to reset your PCS password",
                cancellationToken))
        {
            return;
        }

        await RecordAsync(
            AuditActions.PasswordResetRequested,
            user,
            null,
            cancellationToken);
    }

    public async Task<bool> ResetPasswordAsync(
        string identifier,
        string code,
        string newPassword,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(newPassword) ||
            newPassword.Length < MinPasswordLength)
        {
            return false;
        }

        User? user = await FindUserAsync(identifier, cancellationToken);

        if (user is null)
        {
            return false;
        }

        if (!await ConsumeCodeAsync(user, ResetPurpose, code, cancellationToken))
        {
            await RecordAsync(
                AuditActions.PasswordResetFailed,
                user,
                "code_rejected",
                cancellationToken);

            return false;
        }

        DateTime now = Now;

        user.PasswordHash = _passwordHasher.Hash(newPassword);
        user.MustChangePassword = false;
        user.FailedLoginCount = 0;
        user.LockoutEnd = null;
        user.UpdatedAt = now;

        // The code reached the mailbox, which proves control of the address.
        user.EmailVerifiedAt ??= now;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _refreshTokens.RevokeAllForUserAsync(
            user.Id,
            "password_reset",
            cancellationToken);

        await RecordAsync(
            AuditActions.PasswordReset,
            user,
            null,
            cancellationToken);

        return true;
    }

    public async Task<bool> SendEmailVerificationAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        User? user = await LoadActiveUserAsync(userId, cancellationToken);

        if (user is null ||
            string.IsNullOrWhiteSpace(user.Email) ||
            user.EmailVerifiedAt.HasValue)
        {
            return false;
        }

        return await SendCodeAsync(
            user,
            VerifyPurpose,
            "PCS email verification code",
            "Use this code to verify your email address in PCS",
            cancellationToken);
    }

    public async Task<bool> VerifyEmailAsync(
        Guid userId,
        string code,
        CancellationToken cancellationToken = default)
    {
        User? user = await LoadActiveUserAsync(userId, cancellationToken);

        if (user is null || user.EmailVerifiedAt.HasValue)
        {
            return false;
        }

        if (!await ConsumeCodeAsync(user, VerifyPurpose, code, cancellationToken))
        {
            return false;
        }

        user.EmailVerifiedAt = Now;
        await _dbContext.SaveChangesAsync(cancellationToken);

        await RecordAsync(
            AuditActions.EmailVerified,
            user,
            null,
            cancellationToken);

        return true;
    }

    // ---------------------------------------------------------------

    // Returns false when a code was sent recently (cooldown) or the message
    // could not be sent. Failures are logged, never reported to the caller.
    private async Task<bool> SendCodeAsync(
        User user,
        string purpose,
        string subject,
        string intro,
        CancellationToken cancellationToken)
    {
        DateTime now = Now;
        DateTime cooldownStart = now.AddSeconds(-_options.ResendCooldownSeconds);

        bool recent = await _dbContext.PasswordResetTokens.AnyAsync(
            x => x.UserId == user.Id &&
                 x.Purpose == purpose &&
                 x.CreatedAt > cooldownStart,
            cancellationToken);

        if (recent)
        {
            return false;
        }

        List<PasswordResetToken> open = await _dbContext.PasswordResetTokens
            .Where(x => x.UserId == user.Id &&
                        x.Purpose == purpose &&
                        x.UsedAt == null)
            .ToListAsync(cancellationToken);

        foreach (PasswordResetToken old in open)
        {
            old.UsedAt = now;
        }

        string code = GenerateCode();

        _dbContext.PasswordResetTokens.Add(new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Purpose = purpose,
            TokenHash = Protect(purpose, user.Id, code),
            CreatedAt = now,
            ExpiresAt = now.AddMinutes(_options.CodeMinutes)
        });

        await _dbContext.SaveChangesAsync(cancellationToken);

        string shown = $"{code[..4]}-{code[4..]}";

        string body =
            $"{intro}:{Environment.NewLine}{Environment.NewLine}" +
            $"    {shown}{Environment.NewLine}{Environment.NewLine}" +
            $"The code is valid for {_options.CodeMinutes} minutes and can be used once. " +
            "If you did not ask for it, ignore this message." +
            $"{Environment.NewLine}{Environment.NewLine}" +
            $"این کد {_options.CodeMinutes} دقیقه اعتبار دارد و فقط یک بار قابل استفاده است. " +
            "اگر شما درخواست نکرده‌اید، این پیام را نادیده بگیرید.";

        try
        {
            await _emailSender.SendAsync(
                new EmailMessage(user.Email, subject, body),
                cancellationToken);
        }
        catch (Exception exception) when (
            exception is not OperationCanceledException)
        {
            _logger?.LogError(
                exception,
                "Could not send a {Purpose} email.",
                purpose);

            return false;
        }

        return true;
    }

    // Checks the code against the newest open code of the user. A wrong guess
    // counts against that code; at the limit it is dead even for the right code.
    private async Task<bool> ConsumeCodeAsync(
        User user,
        string purpose,
        string code,
        CancellationToken cancellationToken)
    {
        DateTime now = Now;

        PasswordResetToken? token = await _dbContext.PasswordResetTokens
            .Where(x => x.UserId == user.Id &&
                        x.Purpose == purpose &&
                        x.UsedAt == null &&
                        x.ExpiresAt > now &&
                        x.Attempts < _options.MaxAttempts)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (token is null)
        {
            return false;
        }

        string normalised = Normalise(code);

        bool match = normalised.Length == CodeLength &&
            CryptographicOperations.FixedTimeEquals(
                Encoding.ASCII.GetBytes(token.TokenHash),
                Encoding.ASCII.GetBytes(Protect(purpose, user.Id, normalised)));

        if (!match)
        {
            token.Attempts++;
            await _dbContext.SaveChangesAsync(cancellationToken);

            return false;
        }

        token.UsedAt = now;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }

    private async Task<User?> FindUserAsync(
        string identifier,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(identifier))
        {
            return null;
        }

        List<User> matches = await UserLookup
            .ByIdentifier(
                _dbContext.Users.IgnoreQueryFilters(),
                identifier)
            .Where(x => x.IsActive && !x.IsDeleted)
            .Take(2)
            .ToListAsync(cancellationToken);

        return matches.Count == 1 ? matches[0] : null;
    }

    private Task<User?> LoadActiveUserAsync(
        Guid userId,
        CancellationToken cancellationToken) =>
        _dbContext.Users
            .IgnoreQueryFilters()
            .SingleOrDefaultAsync(
                x => x.Id == userId && x.IsActive && !x.IsDeleted,
                cancellationToken);

    private Task RecordAsync(
        string action,
        User user,
        string? details,
        CancellationToken cancellationToken) =>
        _auditService is null
            ? Task.CompletedTask
            : _auditService.RecordAsync(
                new AuditEvent(
                    AuditModules.Security,
                    "User",
                    user.Id.ToString(),
                    action,
                    user.Id,
                    user.UserName,
                    null,
                    details),
                cancellationToken);

    private static string GenerateCode()
    {
        var chars = new char[CodeLength];

        for (int i = 0; i < chars.Length; i++)
        {
            chars[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
        }

        return new string(chars);
    }

    private static string Normalise(string? code) =>
        string.Concat((code ?? string.Empty)
            .Where(c => !char.IsWhiteSpace(c) && c != '-'))
            .ToUpperInvariant();

    // The code space is small, so an unkeyed hash could be reversed from a
    // leaked table. Keying it with a server secret prevents that.
    private string Protect(string purpose, Guid userId, string code)
    {
        if (string.IsNullOrWhiteSpace(_options.CodeKey))
        {
            throw new InvalidOperationException(
                "Account recovery needs a key: set Jwt:Secret or Security:AccountRecovery:CodeKey.");
        }

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_options.CodeKey));

        return Convert.ToHexString(
            hmac.ComputeHash(Encoding.UTF8.GetBytes($"{purpose}:{userId:N}:{code}")));
    }
}
