using PCS.Domain.Common;

namespace PCS.Domain.Entities.PMS;

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

    public string Description { get; set; } = string.Empty;

    public int Version { get; set; }

    public DateTime CreatedOn { get; set; }


    // ==========================================
    // Schedule Snapshot
    // ==========================================

    public DateTime? PlannedStart { get; set; }

    public DateTime? PlannedFinish { get; set; }

    public int PlannedDuration { get; set; }


    // ==========================================
    // Cost Snapshot
    // ==========================================

    public decimal TotalBudget { get; set; }

    public decimal PlannedValue { get; set; }


    // ==========================================
    // Status
    // ==========================================

    public bool IsApproved { get; set; }

    public bool IsActive { get; set; }


    // ==========================================
    // Navigation
    // ==========================================

    public Project Project { get; set; } = null!;
}