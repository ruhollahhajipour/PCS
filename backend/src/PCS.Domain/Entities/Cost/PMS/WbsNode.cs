using PCS.Domain.Common;

namespace PCS.Domain.Entities.PMS;

public class WbsNode : AuditableEntity
{
    // ==========================================
    // Project
    // ==========================================

    public Guid ProjectId { get; set; }

    public Guid? ParentId { get; set; }


    // ==========================================
    // WBS Information
    // ==========================================

    // Example: 1.2.3
    public string Code { get; set; } = string.Empty;

    // WBS Title
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }


    // ==========================================
    // Hierarchy
    // ==========================================

    // Root = 0
    public int Level { get; set; }

    // Display Order
    public int SortOrder { get; set; }

    // Example:
    // 1
    // 1.1
    // 1.1.2
    public string Path { get; set; } = string.Empty;


    // ==========================================
    // Cost Control
    // ==========================================

    public decimal Budget { get; set; }

    public decimal ActualCost { get; set; }

    public decimal Weight { get; set; }

    public decimal Progress { get; set; }


    // ==========================================
    // Status
    // ==========================================

    public bool IsActive { get; set; } = true;


    // ==========================================
    // Navigation
    // ==========================================

    public Project Project { get; set; } = null!;

    public WbsNode? Parent { get; set; }

    public ICollection<WbsNode> Children { get; set; }
        = new List<WbsNode>();

    public ICollection<Activity> Activities { get; set; }
        = new List<Activity>();
}