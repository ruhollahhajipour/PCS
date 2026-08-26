using PCS.Domain.Entities.Planning;
using PCS.Domain.Common;

namespace PCS.Domain.Entities;

public class Project : AuditableEntity
{
    // ==========================
    // Basic Information
    // ==========================

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? ShortName { get; set; }

    public string? Description { get; set; }


    // ==========================
    // Organization
    // ==========================

    public Guid CompanyId { get; set; }

    public Company Company { get; set; } = null!;

    public Guid? PlantId { get; set; }


    // ==========================
    // Contract
    // ==========================

    public string? ContractNo { get; set; }

    public string? Client { get; set; }

    public string? Contractor { get; set; }

    public string? Consultant { get; set; }


    // ==========================
    // Schedule
    // ==========================

    public DateOnly StartDate { get; set; }

    public DateOnly? FinishDate { get; set; }


    // ==========================
    // Cost
    // ==========================

    public decimal Budget { get; set; }

    public decimal ActualCost { get; set; }

    public string Currency { get; set; } = "USD";


    // ==========================
    // Performance (EVM)
    // ==========================

    public decimal Progress { get; set; }

    public decimal SPI { get; set; } = 1;

    public decimal CPI { get; set; } = 1;


    // ==========================
    // Modules
    // ==========================

    public bool IsCostControlEnabled { get; set; } = false;

    public DateTime? CostControlActivatedDate { get; set; }


    // ==========================
    // Planning Navigation
    // ==========================

    public ICollection<WbsNode> WbsNodes { get; set; }
        = new List<WbsNode>();

    public ICollection<Activity> Activities { get; set; }
        = new List<Activity>();

    public ICollection<ProjectBaseline> Baselines { get; set; }
        = new List<ProjectBaseline>();

    public ICollection<ProjectCalendar> Calendars { get; set; }
        = new List<ProjectCalendar>();


    // ==========================
    // Status
    // ==========================

    public string Status { get; set; } = "Planning";

    public bool IsActive { get; set; } = true;
}