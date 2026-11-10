namespace PCS.Application.Common.Interfaces;

/// <summary>
/// Request-scoped facts attached to every audit record. Implemented by the
/// API from the current HTTP request; absent outside a request (installer,
/// seeding, background work), in which case records are attributed to "system".
/// </summary>
public interface IAuditContext
{
    string? Username { get; }

    string? IpAddress { get; }

    string? UserAgent { get; }

    string? CorrelationId { get; }
}
