using PCS.Domain.Common;

namespace PCS.Domain.Entities.PMS;

public class ProgressEntry : AuditableEntity
{
    public Guid ActivityId { get; set; }


    // Status Date
    public DateTime ProgressDate { get; set; }


    // Physical Progress %
    public decimal Progress { get; set; }


    // Actual Cost (AC)
    public decimal ActualCost { get; set; }


    // Earned Value (EV)
    public decimal EarnedValue { get; set; }


    // Planned Value (PV)
    public decimal PlannedValue { get; set; }


    // Remaining Cost Forecast
    public decimal RemainingCost { get; set; }


    // Forecast Finish Date
    public DateTime? ForecastFinish { get; set; }



    public Activity Activity { get; set; } = null!;
}