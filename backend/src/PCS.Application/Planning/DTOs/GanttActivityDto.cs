namespace PCS.Application.Planning.DTOs;

public class GanttActivityDto
{
    // ==========================================
    // Identity
    // ==========================================

    public Guid Id { get; set; }

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }


    // ==========================================
    // Timeline Compatibility
    // ==========================================
    // These fields are kept for compatibility
    // with the current Gantt implementation.

    public int Start { get; set; }

    public int Finish { get; set; }

    public int Duration { get; set; }


    // ==========================================
    // Planned Schedule
    // ==========================================

    public DateTime? PlannedStart { get; set; }

    public DateTime? PlannedFinish { get; set; }


    // ==========================================
    // Actual Schedule
    // ==========================================

    public DateTime? ActualStart { get; set; }

    public DateTime? ActualFinish { get; set; }

    public int RemainingDuration { get; set; }


    // ==========================================
    // Constraint
    // ==========================================

    public string ConstraintType { get; set; } = "ASAP";

    public DateTime? ConstraintDate { get; set; }


    // ==========================================
    // Progress & Weight
    // ==========================================

    public decimal Progress { get; set; }

    public decimal Weight { get; set; }


    // ==========================================
    // Cost / EVM
    // ==========================================

    public decimal Budget { get; set; }

    public decimal ActualCost { get; set; }

    public decimal EarnedValue { get; set; }


    // ==========================================
    // CPM Scheduling
    // ==========================================

    public int EarlyStart { get; set; }

    public int EarlyFinish { get; set; }

    public int LateStart { get; set; }

    public int LateFinish { get; set; }

    public int TotalFloat { get; set; }

    public int FreeFloat { get; set; }

    public int DrivingFloat { get; set; }

    // Kept for compatibility with the current Gantt.
    public int Float { get; set; }

    public bool IsCritical { get; set; }


    // ==========================================
    // Status
    // ==========================================

    public string Status { get; set; } = "NotStarted";

    public bool IsMilestone { get; set; }


    // ==========================================
    // WBS Context
    // ==========================================

    public Guid? WbsNodeId { get; set; }

    public string? WbsCode { get; set; }

    public string? WbsName { get; set; }

    public int WbsLevel { get; set; }


    // ==========================================
    // Relationships
    // ==========================================

    public List<GanttRelationshipDto> Predecessors { get; set; }
        = new();

    public List<GanttRelationshipDto> Successors { get; set; }
        = new();
}


// ======================================================
// GANTT RELATIONSHIP
// ======================================================

public class GanttRelationshipDto
{
    /// <summary>
    /// Related activity ID.
    /// For a predecessor relationship this is the predecessor.
    /// For a successor relationship this is the successor.
    /// </summary>
    public Guid ActivityId { get; set; }


    /// <summary>
    /// Related activity code.
    /// </summary>
    public string Code { get; set; } = string.Empty;


    /// <summary>
    /// Relationship type:
    /// FS = Finish to Start
    /// SS = Start to Start
    /// FF = Finish to Finish
    /// SF = Start to Finish
    /// </summary>
    public string Type { get; set; } = "FS";


    /// <summary>
    /// Positive = Lag
    /// Negative = Lead
    /// Unit = Day
    /// </summary>
    public int Lag { get; set; }
}


// ======================================================
// GANTT PROJECT
// ======================================================

public class GanttProjectDto
{
    public Guid ProjectId { get; set; }

    public int Duration { get; set; }

    public List<GanttActivityDto> Activities { get; set; }
        = new();
}