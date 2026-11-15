using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using PCS.API.Middleware;

namespace PCS.Application.Tests.Api;

public sealed class ExceptionMiddlewareTests
{
    [Theory]
    [InlineData(typeof(KeyNotFoundException), HttpStatusCode.NotFound)]
    [InlineData(typeof(UnauthorizedAccessException), HttpStatusCode.Forbidden)]
    [InlineData(typeof(ArgumentException), HttpStatusCode.BadRequest)]
    [InlineData(typeof(InvalidOperationException), HttpStatusCode.BadRequest)]
    [InlineData(typeof(NullReferenceException), HttpStatusCode.InternalServerError)]
    [InlineData(typeof(Exception), HttpStatusCode.InternalServerError)]
    public async Task Exceptions_map_to_the_right_status(Type exceptionType, HttpStatusCode expected)
    {
        var middleware = new ExceptionMiddleware(
            _ => throw (Exception)Activator.CreateInstance(exceptionType, "secret internal detail")!,
            NullLogger<ExceptionMiddleware>.Instance);

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)expected, context.Response.StatusCode);

        context.Response.Body.Position = 0;
        string body = await new StreamReader(context.Response.Body).ReadToEndAsync();

        // Internal exception text never reaches the client.
        Assert.DoesNotContain("secret internal detail", body);
    }
}
