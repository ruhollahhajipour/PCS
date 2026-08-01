using PCS.Domain.Entities;

namespace PCS.Application.Common.Interfaces;

public interface IAuditService
{
    Task WriteAsync(AuditLog log);
}