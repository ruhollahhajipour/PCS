using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using PCS.Application.Common.Auditing;
using PCS.Application.Common.Interfaces;
using PCS.Domain.Entities;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Services;

public sealed class AuditService : IAuditService
{
    private const int MaxUsernameLength = 100;
    private const int MaxDetailsLength = 500;

    private readonly PCSDbContext _dbContext;
    private readonly IAuditContext? _auditContext;
    private readonly ILogger<AuditService>? _logger;


    public AuditService(
        PCSDbContext dbContext,
        IAuditContext? auditContext = null,
        ILogger<AuditService>? logger = null)
    {
        _dbContext = dbContext;
        _auditContext = auditContext;
        _logger = logger;
    }


    // ============================================================
    // Write Audit Log
    // ============================================================

    public async Task WriteAsync(
        AuditLog log)
    {
        ArgumentNullException.ThrowIfNull(log);


        if (log.Id == Guid.Empty)
        {
            log.Id =
                Guid.NewGuid();
        }


        if (log.CreatedAt == default)
        {
            log.CreatedAt =
                DateTime.UtcNow;
        }


        await _dbContext.AuditLogs.AddAsync(
            log);


        await _dbContext.SaveChangesAsync();
    }


    // ============================================================
    // Explicit business events
    // ============================================================

    public async Task RecordAsync(
        AuditEvent auditEvent,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(auditEvent);

        AuditLog? log = null;

        try
        {
            string? username =
                auditEvent.Username ?? _auditContext?.Username;

            log = new AuditLog
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                UserId = auditEvent.UserId,
                Username = string.IsNullOrWhiteSpace(username)
                    ? "system"
                    : Truncate(username.Trim(), MaxUsernameLength),
                CompanyId = auditEvent.CompanyId,
                Module = auditEvent.Module,
                Entity = auditEvent.Entity,
                EntityId = auditEvent.EntityId,
                Action = auditEvent.Action,
                NewValues = string.IsNullOrWhiteSpace(auditEvent.Details)
                    ? null
                    : Truncate(auditEvent.Details, MaxDetailsLength),
                IpAddress = _auditContext?.IpAddress,
                UserAgent = _auditContext?.UserAgent,
                CorrelationId = _auditContext?.CorrelationId
            };

            await _dbContext.AuditLogs.AddAsync(
                log,
                cancellationToken);

            await _dbContext.SaveChangesAsync(
                cancellationToken);
        }
        catch (Exception exception) when (
            exception is not OperationCanceledException)
        {
            // Auditing must not take the audited operation down with it. Detach
            // the failed row so it is not retried by the next unrelated save.
            if (log is not null)
            {
                _dbContext.Entry(log).State = EntityState.Detached;
            }

            _logger?.LogError(
                exception,
                "Failed to write audit event {Action} for {Entity}.",
                auditEvent.Action,
                auditEvent.Entity);
        }
    }


    private static string Truncate(
        string value,
        int maxLength) =>
        value.Length <= maxLength
            ? value
            : value[..maxLength];
}
