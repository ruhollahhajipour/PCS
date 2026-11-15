namespace PCS.Application.Identity;

/// <summary>
/// Account lockout policy. Bound from the "Security:Lockout" configuration
/// section. A non-positive <see cref="MaxFailedAttempts"/> disables lockout.
/// </summary>
public sealed class LockoutOptions
{
    public const string SectionName = "Security:Lockout";

    public int MaxFailedAttempts { get; set; } = 5;

    public int LockoutMinutes { get; set; } = 15;

    public bool Enabled => MaxFailedAttempts > 0 && LockoutMinutes > 0;
}
