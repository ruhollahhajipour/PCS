using PCS.Domain.Common;

namespace PCS.Domain.Entities.Planning;

public class ProgressEntry : AuditableEntity
{
    // ==========================================
    // Activity
    // ==========================================

    public Guid ActivityId { get; set; }


    // ==========================================
    // Progress Date
    // ==========================================

    // Status Date
    public DateTime ProgressDate { get; set; }


    // ==========================================
    // Physical Progress
    // ==========================================

    public decimal Progress { get; set; } = 0;


    // ==========================================
    // EVM Values
    // ==========================================

    // Actual Cost (AC)
    public decimal ActualCost { get; set; }


    // Earned Value (EV)
    public decimal EarnedValue { get; set; }


    // Planned Value (PV)
    public decimal PlannedValue { get; set; }


    // Remaining Cost Forecast
    public decimal RemainingCost { get; set; }


    // ==========================================
    // Forecast
    // ==========================================

    public DateTime? ForecastFinish { get; set; }


    // ==========================================
    // Navigation
    // ==========================================

    public Activity Activity { get; set; } = null!;
}