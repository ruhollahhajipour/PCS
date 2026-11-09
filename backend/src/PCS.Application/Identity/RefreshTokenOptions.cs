namespace PCS.Application.Identity;

/// <summary>Bound from the "Security:RefreshToken" configuration section.</summary>
public sealed class RefreshTokenOptions
{
    public const string SectionName = "Security:RefreshToken";

    /// <summary>Lifetime of a session without activity, in days.</summary>
    public int LifetimeDays { get; set; } = 14;

    /// <summary>
    /// A just-rotated token presented again within this window is rejected
    /// without revoking the session, so two browser tabs refreshing at the
    /// same moment do not log the user out.
    /// </summary>
    public int ReuseGraceSeconds { get; set; } = 10;
}
