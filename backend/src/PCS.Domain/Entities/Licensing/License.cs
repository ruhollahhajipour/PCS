using PCS.Domain.Common;
using PCS.Domain.Entities;

namespace PCS.Domain.Entities.Licensing;

public class License : AuditableEntity
{
    /// <summary>
    /// Company that owns this license.
    /// </summary>
    public Guid CompanyId { get; set; }

    /// <summary>
    /// Unique license key assigned to the company.
    /// </summary>
    public string LicenseKey { get; set; } = string.Empty;

    /// <summary>
    /// Current license status.
    /// </summary>
    public LicenseStatus Status { get; set; } = LicenseStatus.Active;

    /// <summary>
    /// UTC date when the license was issued.
    /// </summary>
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// UTC expiration date. Null means no expiration.
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Company that owns the license.
    /// </summary>
    public Company Company { get; set; } = null!;

    /// <summary>
    /// Modules included in this license.
    /// </summary>
    public ICollection<LicenseModule> Modules { get; set; } = new List<LicenseModule>();
}

public enum LicenseStatus
{
    Active = 1,
    Suspended = 2,
    Expired = 3,
    Revoked = 4
}