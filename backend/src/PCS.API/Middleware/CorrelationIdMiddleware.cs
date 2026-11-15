using Microsoft.AspNetCore.Http;
using Serilog.Context;

namespace PCS.API.Middleware;

/// <summary>
/// Gives every request a correlation id: the caller's X-Correlation-ID when it
/// is a short safe token, otherwise a new one. It is echoed in the response,
/// attached to every log event of the request and stored on audit records.
/// </summary>
public sealed class CorrelationIdMiddleware
{
    public const string HeaderName = "X-Correlation-ID";
    public const string ItemKey = "PCS.CorrelationId";

    private const int MaxLength = 64;

    private readonly RequestDelegate _next;

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        string correlationId = Resolve(context);

        context.Items[ItemKey] = correlationId;

        context.Response.OnStarting(() =>
        {
            context.Response.Headers[HeaderName] = correlationId;
            return Task.CompletedTask;
        });

        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            await _next(context);
        }
    }

    internal static string Resolve(HttpContext context)
    {
        string? incoming = context.Request.Headers[HeaderName].FirstOrDefault();

        if (!string.IsNullOrWhiteSpace(incoming) &&
            incoming.Length <= MaxLength &&
            incoming.All(c => char.IsAsciiLetterOrDigit(c) || c == '-' || c == '_'))
        {
            return incoming;
        }

        return Guid.NewGuid().ToString("N");
    }
}
