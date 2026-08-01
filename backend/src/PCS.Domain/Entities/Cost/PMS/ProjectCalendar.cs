using PCS.Domain.Common;

namespace PCS.Domain.Entities.PMS;

public class ProjectCalendar : AuditableEntity
{
    // ==========================================
    // Project
    // ==========================================

    public Guid ProjectId { get; set; }


    // ==========================================
    // Calendar
    // ==========================================

    // Example:
    // Standard Calendar
    // Shutdown Calendar
    // Night Shift
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }


    // ==========================================
    // Working Time
    // ==========================================

    public int WorkingDaysPerWeek { get; set; }

    public decimal WorkingHoursPerDay { get; set; }


    // Default working week

    public bool SaturdayWorking { get; set; }

    public bool SundayWorking { get; set; }

    public bool MondayWorking { get; set; }

    public bool TuesdayWorking { get; set; }

    public bool WednesdayWorking { get; set; }

    public bool ThursdayWorking { get; set; }

    public bool FridayWorking { get; set; }


    // ==========================================
    // Shift Time
    // ==========================================

    public TimeOnly? WorkStart { get; set; }

    public TimeOnly? WorkFinish { get; set; }


    // ==========================================
    // Calendar Status
    // ==========================================

    public bool IsDefault { get; set; }

    public bool IsActive { get; set; } = true;


    // ==========================================
    // Navigation
    // ==========================================

    public Project Project { get; set; } = null!;
}