using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using PCS.API.Middleware;

namespace PCS.Application.Tests.Security;

public sealed class ExceptionMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_WhenNextThrows_ReturnsSanitizedResponseWithCorrelationId()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        var middleware = new ExceptionMiddleware(
            _ => throw new InvalidOperationException("sensitive database details"),
            NullLogger<ExceptionMiddleware>.Instance);

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);

        var correlationId = context.Response.Headers["X-Correlation-ID"].ToString();
        Assert.False(string.IsNullOrWhiteSpace(correlationId));
        Assert.Equal(context.TraceIdentifier, correlationId);

        context.Response.Body.Position = 0;

        using var document = await JsonDocument.ParseAsync(context.Response.Body);
        var response = document.RootElement;
        var serialized = response.GetRawText();

        Assert.Contains("An unexpected error occurred.", serialized);
        Assert.Contains(correlationId, serialized);
        Assert.DoesNotContain("sensitive database details", serialized);
    }

    [Fact]
    public async Task InvokeAsync_WhenNextSucceeds_ContinuesNormally()
    {
        var invoked = false;
        var context = new DefaultHttpContext();

        var middleware = new ExceptionMiddleware(
            _ =>
            {
                invoked = true;
                return Task.CompletedTask;
            },
            NullLogger<ExceptionMiddleware>.Instance);

        await middleware.InvokeAsync(context);

        Assert.True(invoked);
        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
        Assert.False(context.Response.Headers.ContainsKey("X-Correlation-ID"));
    }
}
