using PCS.Domain.Common;

namespace PCS.Domain.Entities.PMS;

public class ActivityRelationship : BaseEntity
{
    // ==========================================
    // Activities
    // ==========================================

    public Guid PredecessorId { get; set; }

    public Guid SuccessorId { get; set; }


    // ==========================================
    // Relationship
    // ==========================================

    /// <summary>
    /// FS = Finish Start
    /// SS = Start Start
    /// FF = Finish Finish
    /// SF = Start Finish
    /// </summary>
    public string Type { get; set; } = "FS";


    /// <summary>
    /// Positive = Lag
    /// Negative = Lead
    /// Unit = Day
    /// </summary>
    public int Lag { get; set; }


    /// <summary>
    /// Optional description
    /// </summary>
    public string? Description { get; set; }


    /// <summary>
    /// Indicates whether the relationship is active.
    /// </summary>
    public bool IsActive { get; set; } = true;


    // ==========================================
    // Navigation
    // ==========================================

    public Activity Predecessor { get; set; } = null!;

    public Activity Successor { get; set; } = null!;
}