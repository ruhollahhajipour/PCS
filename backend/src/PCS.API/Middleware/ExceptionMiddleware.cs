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

    public async Task InvokeAsync(
        HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            if (context.Response.HasStarted)
            {
                _logger.LogError(
                    ex,
                    "Unhandled exception after the response started for {Method} {Path}.",
                    context.Request.Method,
                    context.Request.Path);

                throw;
            }

            (HttpStatusCode status, string message, bool expected) = Map(ex);

            if (expected)
            {
                // A business rule or access check said no; not a server fault.
                _logger.LogWarning(
                    "Request {Method} {Path} was rejected with {StatusCode}: {ExceptionType}.",
                    context.Request.Method,
                    context.Request.Path,
                    (int)status,
                    ex.GetType().Name);
            }
            else
            {
                _logger.LogError(
                    ex,
                    "Unhandled exception occurred for request {Method} {Path}.",
                    context.Request.Method,
                    context.Request.Path);
            }

            context.Response.Clear();
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)status;

            await context.Response.WriteAsJsonAsync(
                ApiResponse<object>.Fail(message));
        }
    }

    // Services signal expected outcomes with these exception types. Messages
    // are deliberately generic: they were written for developers and a
    // framework InvalidOperationException must never reach the client.
    private static (HttpStatusCode Status, string Message, bool Expected) Map(
        Exception exception) =>
        exception switch
        {
            KeyNotFoundException =>
                (HttpStatusCode.NotFound,
                 "The requested resource was not found.", true),

            UnauthorizedAccessException =>
                (HttpStatusCode.Forbidden,
                 "You do not have access to this resource.", true),

            ArgumentException or InvalidOperationException =>
                (HttpStatusCode.BadRequest,
                 "The request could not be processed.", true),

            _ =>
                (HttpStatusCode.InternalServerError,
                 "An unexpected error occurred.", false)
        };
}
