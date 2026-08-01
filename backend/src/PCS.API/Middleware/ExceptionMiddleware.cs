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
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                ex.Message);

            context.Response.ContentType =
                "application/json";

            context.Response.StatusCode =
                (int)HttpStatusCode.InternalServerError;

            var response =
                ApiResponse<object>.Fail(
                    "An unexpected error occurred.",
                    new[]
                    {
                        ex.Message
                    });

            await context.Response.WriteAsJsonAsync(
                response);
        }
    }
}