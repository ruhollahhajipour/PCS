using PCS.Domain.Common;

namespace PCS.Domain.Entities;

public class Plant : AuditableEntity
{
    // ==========================
    // Basic Information
    // ==========================

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? ShortName { get; set; }

    public string? Description { get; set; }


    // ==========================
    // Organization
    // ==========================

    public Guid CompanyId { get; set; }

    public Company Company { get; set; } = null!;


    // ==========================
    // Contact
    // ==========================

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }


    // ==========================
    // Status
    // ==========================

    public bool IsActive { get; set; } = true;


    // ==========================
    // Projects
    // ==========================

    public ICollection<Project> Projects { get; set; }
        = new List<Project>();
}