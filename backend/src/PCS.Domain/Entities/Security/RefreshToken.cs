using PCS.Domain.Common;

namespace PCS.Domain.Entities.Security;

/// <summary>
/// A refresh token. Only the SHA-256 hash of the token is stored. Tokens that
/// descend from one login share a <see cref="FamilyId"/> (one session), so a
/// reused token can revoke the whole session.
/// </summary>
public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }

    public Guid FamilyId { get; set; }

    public string TokenHash { get; set; } = string.Empty;

    public Guid? CompanyId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public string? RevokedReason { get; set; }

    public Guid? ReplacedByTokenId { get; set; }

    public string? CreatedByIp { get; set; }

    public string? UserAgent { get; set; }

    public User User { get; set; } = null!;
}
