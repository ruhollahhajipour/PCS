namespace PCS.Application.Identity.DTOs;

public class RefreshRequest
{
    public string RefreshToken { get; set; } = "";

    /// <summary>Company the client is currently working in, if any.</summary>
    public Guid? CompanyId { get; set; }
}

public class LogoutRequest
{
    public string? RefreshToken { get; set; }
}

public sealed record IssuedRefreshToken(string Token, DateTime ExpiresAt);

public sealed record RefreshRotation(
    Guid UserId,
    Guid FamilyId,
    Guid? CompanyId,
    string Token,
    DateTime ExpiresAt);

public sealed class SessionDto
{
    /// <summary>Identifies the session (token family), not a single token.</summary>
    public Guid Id { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime LastUsedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }
}
