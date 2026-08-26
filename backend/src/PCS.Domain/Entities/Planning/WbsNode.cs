using PCS.Domain.Common;

namespace PCS.Domain.Entities.Planning;

public class WbsNode : AuditableEntity
{
    public Guid ProjectId { get; set; }

    public Guid? ParentId { get; set; }


    public string Code { get; set; } = string.Empty;

    public string? ExternalCode { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }


    public string Type { get; set; }
        = "WorkPackage";


    public int Level { get; set; }

    public int SortOrder { get; set; }


    public string Path { get; set; }
        = string.Empty;



    public bool IsCostControlEnabled { get; set; }




    // =====================================================
    // Calculated Cost / Progress
    // =====================================================

    /// <summary>
    /// Calculated from Activities under this WBS
    /// </summary>
    public decimal Budget { get; set; }


    /// <summary>
    /// Actual Cost roll-up
    /// </summary>
    public decimal ActualCost { get; set; }



    /// <summary>
    /// W.F
    /// Budget / Parent WBS Budget
    /// </summary>
    public decimal WeightFactor { get; set; }



    /// <summary>
    /// W.V
    /// Budget / Total Project Budget
    /// </summary>
    public decimal WeightValue { get; set; }



    /// <summary>
    /// Original stored weight
    /// </summary>
    public decimal Weight { get; set; }



    /// <summary>
    /// Earned Value
    /// </summary>
    public decimal EarnedValue { get; set; }



    /// <summary>
    /// Planned Value
    /// </summary>
    public decimal PlannedValue { get; set; }



    /// <summary>
    /// Weighted progress of WBS
    /// </summary>
    public decimal Progress { get; set; }




    public bool IsActive { get; set; }
        = true;




    // Navigation

    public Project Project { get; set; }
        = null!;


    public WbsNode? Parent { get; set; }


    public ICollection<WbsNode> Children { get; set; }
        = new List<WbsNode>();


    public ICollection<Activity> Activities { get; set; }
        = new List<Activity>();
}