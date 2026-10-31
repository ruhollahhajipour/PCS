using PCS.Domain.Common;

namespace PCS.Domain.Entities.Licensing;

public class LicenseModule : AuditableEntity
{
    /// <summary>
    /// License that owns this module entitlement.
    /// </summary>
    public Guid LicenseId { get; set; }

    /// <summary>
    /// Stable module identifier used by the licensing system.
    /// </summary>
    public string ModuleId { get; set; } = string.Empty;

    /// <summary>
    /// Indicates whether this module is currently enabled.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Optional expiration date for this specific module.
    /// Null means the module follows the parent license expiration.
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Parent license.
    /// </summary>
    public License License { get; set; } = null!;
}