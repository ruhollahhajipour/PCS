using PCS.Domain.Common;

namespace PCS.Domain.Entities.Planning;

/// <summary>
/// Immutable schedule and budget snapshot for one activity in a project baseline.
/// ActivityId is intentionally not a foreign key so historical baselines survive
/// activity deletion or restructuring.
/// </summary>
public class ProjectBaselineActivity : AuditableEntity
{
    public Guid ProjectBaselineId { get; set; }

    public Guid ActivityId { get; set; }

    public string ActivityCode { get; set; } = string.Empty;

    public string ActivityName { get; set; } = string.Empty;

    public string WbsCode { get; set; } = string.Empty;

    public string WbsName { get; set; } = string.Empty;

    public DateTime? PlannedStart { get; set; }

    public DateTime? PlannedFinish { get; set; }

    public int PlannedDuration { get; set; }

    public decimal Budget { get; set; }

    /// <summary>
    /// Bit 0 = Sunday through bit 6 = Saturday, matching System.DayOfWeek.
    /// This is captured at baseline approval time and is not read from a mutable calendar later.
    /// </summary>
    public int WorkingDaysMask { get; set; }

    public decimal WorkingHoursPerDay { get; set; }

    public bool IsMilestone { get; set; }

    public string CalendarName { get; set; } = string.Empty;

    public ProjectBaseline ProjectBaseline { get; set; } = null!;
}
