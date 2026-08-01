using PCS.Domain.Common;
using PCS.Domain.Entities.Security;

namespace PCS.Domain.Entities;

public class CompanyUser : AuditableEntity
{
    // ==========================
    // Relations
    // ==========================

    public Guid CompanyId { get; set; }

    public Guid UserId { get; set; }



    // ==========================
    // Access Control
    // ==========================

    /// <summary>
    /// مدیر اصلی شرکت
    /// در هر شرکت فقط یک نفر می‌تواند باشد
    /// </summary>
    public bool IsPrimaryAdmin { get; set; }
        = false;


    /// <summary>
    /// دسترسی کاربر به شرکت
    /// </summary>
    public bool IsActive { get; set; }
        = true;



    // ==========================
    // Lifecycle
    // ==========================

    /// <summary>
    /// زمان عضویت در شرکت
    /// </summary>
    public DateTime AssignedAt { get; set; }
        = DateTime.UtcNow;


    /// <summary>
    /// زمان فعال شدن نهایی
    /// </summary>
    public DateTime? ActivatedAt { get; set; }


    /// <summary>
    /// زمان قطع دسترسی
    /// </summary>
    public DateTime? RemovedAt { get; set; }



    // ==========================
    // Administration Tracking
    // ==========================

    /// <summary>
    /// چه کسی این کاربر را به شرکت اضافه کرد
    /// </summary>
    public Guid? InvitedByUserId { get; set; }


    /// <summary>
    /// دلیل حذف یا تغییر دسترسی
    /// </summary>
    public string? RemovalReason { get; set; }


    public string? Notes { get; set; }



    // ==========================
    // Navigation
    // ==========================

    public Company Company { get; set; }
        = null!;


    public User User { get; set; }
        = null!;


    public User? InvitedByUser { get; set; }
}