using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Logging.Abstractions;
using PCS.API.Middleware;
using Xunit;

namespace PCS.Application.Tests.Security;

public sealed class ExceptionMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_WhenNextThrows_ReturnsSanitizedResponseWithCorrelationId()
    {
        var context = new DefaultHttpContext();
        context.TraceIdentifier = "pcs-test-trace-id";
        context.Response.Body = new MemoryStream();

        var middleware = new ExceptionMiddleware(
            _ => throw new InvalidOperationException("sensitive database details"),
            NullLogger<ExceptionMiddleware>.Instance);

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);
        var correlationId = context.Response.Headers["X-Correlation-ID"].ToString();
        Assert.Equal(context.TraceIdentifier, correlationId);

        context.Response.Body.Position = 0;
        using var document = await JsonDocument.ParseAsync(context.Response.Body);
        var serialized = document.RootElement.GetRawText();

        Assert.Contains("An unexpected error occurred.", serialized);
        Assert.Contains(correlationId, serialized);
        Assert.DoesNotContain("sensitive database details", serialized);
    }

    [Fact]
    public async Task InvokeAsync_WhenResponseHasStarted_RethrowsOriginalException()
    {
        var context = new DefaultHttpContext();
        var responseFeature = new StartedHttpResponseFeature();
        context.Features.Set<IHttpResponseFeature>(responseFeature);

        Assert.True(context.Response.HasStarted);

        var middleware = new ExceptionMiddleware(
            _ => throw new InvalidOperationException("response already started"),
            NullLogger<ExceptionMiddleware>.Instance);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => middleware.InvokeAsync(context));

        Assert.Equal("response already started", exception.Message);
        Assert.Equal(StatusCodes.Status202Accepted, context.Response.StatusCode);
    }

    private sealed class StartedHttpResponseFeature : IHttpResponseFeature
    {
        public int? StatusCode { get; set; } = StatusCodes.Status202Accepted;
        public string? ReasonPhrase { get; set; }
        public IHeaderDictionary Headers { get; set; } = new HeaderDictionary();
        public Stream Body { get; set; } = new MemoryStream();
        public bool HasStarted => true;

        public void OnStarting(Func<object, Task> callback, object state)
        {
        }

        public void OnCompleted(Func<object, Task> callback, object state)
        {
        }
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
