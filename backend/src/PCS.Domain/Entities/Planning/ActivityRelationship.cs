using PCS.Domain.Common;

namespace PCS.Domain.Entities.Planning;

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
    /// FS = Finish to Start
    /// SS = Start to Start
    /// FF = Finish to Finish
    /// SF = Start to Finish
    /// </summary>
    public string Type { get; set; } = "FS";


    // ==========================================
    // Delay
    // ==========================================

    /// <summary>
    /// Positive = Lag
    /// Negative = Lead
    /// Unit = Day
    /// </summary>
    public int Lag { get; set; }


    // ==========================================
    // Information
    // ==========================================

    public string? Description { get; set; }


    // ==========================================
    // Status
    // ==========================================

    public bool IsActive { get; set; } = true;


    // ==========================================
    // Navigation
    // ==========================================

    public Activity Predecessor { get; set; } = null!;

    public Activity Successor { get; set; } = null!;
}