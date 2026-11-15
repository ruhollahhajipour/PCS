using PCS.Domain.Common;

namespace PCS.Domain.Entities.Security;

public class PasswordResetToken : BaseEntity
{
    public Guid UserId { get; set; }

    public string TokenHash { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime? UsedAt { get; set; }

    /// <summary>What the code is for: "PasswordReset" or "EmailVerification".</summary>
    public string Purpose { get; set; } = "PasswordReset";

    /// <summary>Wrong guesses made against this code.</summary>
    public int Attempts { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}