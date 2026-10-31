using System.Net;
using PCS.Application.Common.Models;

namespace PCS.API.Middleware;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            var traceId = context.TraceIdentifier;

            _logger.LogError(
                exception,
                "Unhandled exception occurred. TraceId: {TraceId}",
                traceId);

            if (context.Response.HasStarted)
            {
                _logger.LogWarning(
                    "The response has already started. The exception cannot be converted to an API error response. TraceId: {TraceId}",
                    traceId);

                throw;
            }

            context.Response.Clear();
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.Headers["X-Correlation-ID"] = traceId;

            var response = ApiResponse<object>.Fail(
                "An unexpected error occurred.",
                new[] { $"Reference: {traceId}" });

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
