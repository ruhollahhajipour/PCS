using PCS.Application.Common.Interfaces;
using PCS.Domain.Entities;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Services;

namespace PCS.Infrastructure.Services;

public sealed class AuditService
    : IAuditService
{
    private readonly PCSDbContext _context;

    public AuditService(
        PCSDbContext context)
    {
        _context = context;
    }

    public async Task WriteAsync(
        AuditLog log)
    {
        await _context.AuditLogs.AddAsync(log);

        await _context.SaveChangesAsync();
    }
}