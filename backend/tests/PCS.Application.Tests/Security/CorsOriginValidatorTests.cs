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

    [Theory]
    [InlineData("*")]
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
