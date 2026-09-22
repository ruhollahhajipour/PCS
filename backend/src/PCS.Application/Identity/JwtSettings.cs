namespace PCS.Application.Identity;

public sealed class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Secret { get; set; } = string.Empty;

    public string Issuer { get; set; } = "PCS";

    public string Audience { get; set; } = "PCS";

    public int ExpirationMinutes { get; set; } = 480;
}