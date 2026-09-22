using PCS.Application.Common.Interfaces;
using PCS.Domain.Entities;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Services;

public sealed class AuditService : IAuditService
{
    private readonly PCSDbContext _dbContext;


    public AuditService(
        PCSDbContext dbContext)
    {
        _dbContext = dbContext;
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
}