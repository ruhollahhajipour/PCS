namespace PCS.Application.Identity;

/// <summary>Bound from "Security:AccountRecovery".</summary>
public sealed class AccountRecoveryOptions
{
    public const string SectionName = "Security:AccountRecovery";

    public int CodeMinutes { get; set; } = 15;

    /// <summary>Wrong guesses allowed against one code.</summary>
    public int MaxAttempts { get; set; } = 5;

    /// <summary>Minimum time between two codes for the same account and purpose.</summary>
    public int ResendCooldownSeconds { get; set; } = 60;

    /// <summary>
    /// Key used to protect stored codes. Defaults to the JWT secret, so no
    /// extra secret has to be provisioned.
    /// </summary>
    public string? CodeKey { get; set; }
}
