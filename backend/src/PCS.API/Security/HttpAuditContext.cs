using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PCS.API.Middleware;
using PCS.Application.Common.Interfaces;

namespace PCS.API.Security;

/// <summary>
/// Supplies request facts to the audit trail. The client address is the TCP
/// peer address: forwarded headers are deliberately not trusted here.
/// </summary>
public sealed class HttpAuditContext : IAuditContext
{
    private const int MaxUserAgentLength = 256;

    private readonly IHttpContextAccessor _httpContextAccessor;

    public HttpAuditContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private HttpContext? Context => _httpContextAccessor.HttpContext;

    public string? Username =>
        Context?.User.FindFirstValue(ClaimTypes.Name);

    public string? IpAddress =>
        Context?.Connection.RemoteIpAddress?.ToString();

    public string? UserAgent
    {
        get
        {
            string? value = Context?.Request.Headers.UserAgent.ToString();

            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            return value.Length <= MaxUserAgentLength
                ? value
                : value[..MaxUserAgentLength];
        }
    }

    public string? CorrelationId =>
        Context?.Items[CorrelationIdMiddleware.ItemKey] as string
        ?? Context?.TraceIdentifier;
}
