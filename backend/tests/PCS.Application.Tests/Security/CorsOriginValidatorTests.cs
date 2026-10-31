using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using PCS.API.Security;
using Xunit;

namespace PCS.Application.Tests.Security;

public sealed class CorsOriginValidatorTests
{
    [Fact]
    public void Normalize_WhenNoOriginsConfigured_ReturnsEmptyAllowList()
    {
        var result = CorsOriginValidator.Normalize(Array.Empty<string>());

        Assert.Empty(result);
    }

    [Fact]
    public void Normalize_ValidatesAndDeduplicatesExactOrigins()
    {
        var result = CorsOriginValidator.Normalize(
        [
            "https://EXAMPLE.com/",
            "https://example.com",
            "http://localhost:5173"
        ]);

        Assert.Equal(
            new[]
            {
                "https://example.com",
                "http://localhost:5173"
            },
            result);
    }

    [Fact]
    public async Task AddPcsCors_AllowsOnlyConfiguredOrigins()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddPcsCors(["https://app.example.com"]);

        using var provider = services.BuildServiceProvider();

        var policyProvider = provider.GetRequiredService<ICorsPolicyProvider>();
        var policy = await policyProvider.GetPolicyAsync(
            new DefaultHttpContext(),
            "PCS");

        Assert.NotNull(policy);

        var corsService = provider.GetRequiredService<ICorsService>();

        var allowedContext = new DefaultHttpContext();
        allowedContext.Request.Headers.Origin = "https://app.example.com";
        Assert.True(
            corsService.EvaluatePolicy(allowedContext, policy!).IsOriginAllowed);

        var deniedContext = new DefaultHttpContext();
        deniedContext.Request.Headers.Origin = "https://evil.example.com";
        Assert.False(
            corsService.EvaluatePolicy(deniedContext, policy!).IsOriginAllowed);

        Assert.True(policy!.AllowAnyHeader);
        Assert.True(policy.AllowAnyMethod);
    }

    [Fact]
    public async Task AddPcsCors_WithEmptyAllowList_DoesNotAllowCrossOriginRequests()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddPcsCors(Array.Empty<string>());

        using var provider = services.BuildServiceProvider();

        var policyProvider = provider.GetRequiredService<ICorsPolicyProvider>();
        var policy = await policyProvider.GetPolicyAsync(
            new DefaultHttpContext(),
            "PCS");

        Assert.NotNull(policy);

        var context = new DefaultHttpContext();
        context.Request.Headers.Origin = "https://external.example.com";

        var result = provider
            .GetRequiredService<ICorsService>()
            .EvaluatePolicy(context, policy!);

        Assert.False(result.IsOriginAllowed);
    }

    [Theory]
    [InlineData("*")]
    [InlineData("https://*.example.com")]
    [InlineData("https://api.*.example.com")]
    [InlineData("ftp://example.com")]
    [InlineData("https://user:password@example.com")]
    [InlineData("https://example.com/api")]
    [InlineData("https://example.com?mode=test")]
    [InlineData("https://example.com#section")]
    [InlineData("not-an-origin")]
    [InlineData(" https://example.com")]
    public void Normalize_RejectsNonOriginValues(string configuredOrigin)
    {
        Assert.Throws<InvalidOperationException>(
            () => CorsOriginValidator.Normalize([configuredOrigin]));
    }
}
