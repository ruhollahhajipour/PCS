using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using PCS.API.Middleware;

namespace PCS.Application.Tests.Security;

public sealed class ExceptionMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_does_not_disclose_exception_or_inner_exception_details()
    {
        const string sensitiveMessage = "Database password and connection details";
        const string sensitiveInnerMessage = "SQL Server host internal-db-01";

        var middleware = new ExceptionMiddleware(
            _ => throw new InvalidOperationException(
                sensitiveMessage,
                new Exception(sensitiveInnerMessage)),
            NullLogger<ExceptionMiddleware>.Instance);

        var context = new DefaultHttpContext();
        await using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);
        Assert.StartsWith("application/json", context.Response.ContentType);

        responseBody.Position = 0;
        using var reader = new StreamReader(responseBody, Encoding.UTF8);
        var response = await reader.ReadToEndAsync();

        Assert.Contains("An unexpected error occurred.", response);
        Assert.DoesNotContain(sensitiveMessage, response);
        Assert.DoesNotContain(sensitiveInnerMessage, response);
    }
}
