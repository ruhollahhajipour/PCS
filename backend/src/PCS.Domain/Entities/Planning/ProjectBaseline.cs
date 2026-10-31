using PCS.Domain.Common;

namespace PCS.Domain.Entities.Planning;

public class ProjectBaseline : AuditableEntity
{
    // ==========================================
    // Project
    // ==========================================

    public Guid ProjectId { get; set; }


    // ==========================================
    // Baseline Information
    // ==========================================

    // Example:
    // Baseline 0
    // Baseline 1
    // Approved Schedule

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Version { get; set; }


    // ==========================================
    // Schedule Snapshot
    // ==========================================

    public DateTime? PlannedStart { get; set; }

    public DateTime? PlannedFinish { get; set; }

    public int PlannedDuration { get; set; }


    // ==========================================
    // Cost / EVM Snapshot
    // ==========================================

    public decimal TotalBudget { get; set; }

    public decimal PlannedValue { get; set; }


    // ==========================================
    // Status
    // ==========================================

    public bool IsApproved { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public string? ApprovedBy { get; set; }

    public bool IsActive { get; set; } = true;


    // ==========================================
    // Navigation
    // ==========================================

    public Project Project { get; set; } = null!;

    public ICollection<ProjectBaselineActivity> Activities { get; set; }
        = new List<ProjectBaselineActivity>();
}