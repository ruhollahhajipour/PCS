using PCS.Application.Common.Auditing;
using PCS.Domain.Entities;

namespace PCS.Application.Common.Interfaces;

public interface IAuditService
{
    Task WriteAsync(AuditLog log);

    /// <summary>
    /// Records an explicit business event. Best effort: a failure to write the
    /// audit record is logged and never fails the operation being audited.
    /// </summary>
    Task RecordAsync(
        AuditEvent auditEvent,
        CancellationToken cancellationToken = default);
}
