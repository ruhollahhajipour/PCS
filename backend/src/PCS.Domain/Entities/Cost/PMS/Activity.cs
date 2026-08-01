using PCS.Domain.Common;

namespace PCS.Domain.Entities.PMS;

public class Activity : AuditableEntity
{
    // ==========================
    // Foreign Keys
    // ==========================

    public Guid ProjectId { get; set; }

    public Guid WbsNodeId { get; set; }

    public Guid? CalendarId { get; set; }


    // ==========================
    // General
    // ==========================

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }


    // ==========================
    // Duration
    // ==========================

    public int Duration { get; set; }

    public int RemainingDuration { get; set; }


    // ==========================
    // Planned Dates
    // ==========================

    public DateTime? PlannedStart { get; set; }

    public DateTime? PlannedFinish { get; set; }


    // ==========================
    // Actual Dates
    // ==========================

    public DateTime? ActualStart { get; set; }

    public DateTime? ActualFinish { get; set; }


    // ==========================
    // Constraint
    // ==========================

    public string ConstraintType { get; set; } = "ASAP";

    public DateTime? ConstraintDate { get; set; }


    // ==========================
    // Progress
    // ==========================

    public decimal Progress { get; set; }

    public decimal PercentComplete
    {
        get => Progress;
        set => Progress = value;
    }

    public decimal Weight { get; set; }


    // ==========================
    // Cost
    // ==========================

    public decimal Budget { get; set; }

    public decimal ActualCost { get; set; }

    public decimal EarnedValue { get; set; }


    // ==========================
    // CPM
    // ==========================

    public int EarlyStart { get; set; }

    public int EarlyFinish { get; set; }

    public int LateStart { get; set; }

    public int LateFinish { get; set; }

    public int TotalFloat { get; set; }

    public int FreeFloat { get; set; }

    public int DrivingFloat { get; set; }

    public bool IsCritical { get; set; }


    // ==========================
    // Status
    // ==========================

    public string Status { get; set; } = "NotStarted";

    public bool IsMilestone { get; set; }


    // ==========================
    // Navigation
    // ==========================

    public Project Project { get; set; } = null!;

    public WbsNode WbsNode { get; set; } = null!;

    public ProjectCalendar? Calendar { get; set; }

    public ICollection<ActivityRelationship> Predecessors
        = new List<ActivityRelationship>();

    public ICollection<ActivityRelationship> Successors
        = new List<ActivityRelationship>();
}