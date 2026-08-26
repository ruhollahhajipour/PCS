namespace PCS.Application.Planning.DTOs;

public class ActivityDto
{
// ==========================================
// Identity
// ==========================================

public Guid Id { get; set; }


public string Code { get; set; }
    = string.Empty;


public string Name { get; set; }
    = string.Empty;



// ==========================================
// WBS Information
// ==========================================

public string WbsCode { get; set; }
    = string.Empty;


public string? WbsName { get; set; }


public int WbsLevel { get; set; }



// ==========================================
// Schedule
// ==========================================

public int Duration { get; set; }


public int RemainingDuration { get; set; }


public DateTime? PlannedStart { get; set; }


public DateTime? PlannedFinish { get; set; }


public DateTime? ActualStart { get; set; }


public DateTime? ActualFinish { get; set; }



// ==========================================
// Constraint
// ==========================================

public string ConstraintType { get; set; }
    = "ASAP";


public DateTime? ConstraintDate { get; set; }



// ==========================================
// Progress & Weight
// ==========================================

/// <summary>
/// Activity progress 0-100
/// </summary>
public decimal Progress { get; set; }



/// <summary>
/// Weight relative to parent WBS (W.F)
/// </summary>
public decimal WeightFactor { get; set; }



/// <summary>
/// Weight relative to whole project (W.V)
/// </summary>
public decimal WeightValue { get; set; }



/// <summary>
/// Original weight value
/// </summary>
public decimal Weight { get; set; }



/// <summary>
/// Weight * Progress
/// </summary>
public decimal WeightedProgress { get; set; }



// ==========================================
// Cost
// ==========================================

public decimal Budget { get; set; }


public decimal ActualCost { get; set; }


public decimal EarnedValue { get; set; }


public decimal PlannedValue { get; set; }



// ==========================================
// EVM Indicators
// ==========================================

public decimal CostVariance { get; set; }


public decimal ScheduleVariance { get; set; }


public decimal CPI { get; set; }


public decimal SPI { get; set; }



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



public bool IsCritical { get; set; }



// ==========================================
// Status
// ==========================================

public string Status { get; set; }
    = "NotStarted";


public bool IsMilestone { get; set; }


}