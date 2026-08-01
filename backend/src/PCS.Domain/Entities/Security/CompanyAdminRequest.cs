using PCS.Domain.Common;
using PCS.Domain.Enums;

namespace PCS.Domain.Entities.Security;

public class CompanyAdminRequest : AuditableEntity
{
    // ==========================
    // Company
    // ==========================

    public Guid CompanyId { get; set; }



    // ==========================
    // Current Administrator
    // ==========================

    /// <summary>
    /// مدیر فعلی شرکت
    /// در صورت فوت یا قطع دسترسی ممکن است Null باشد
    /// </summary>
    public Guid? CurrentAdminId { get; set; }



    // ==========================
    // Proposed Administrator
    // ==========================

    /// <summary>
    /// مدیر پیشنهادی جدید
    /// </summary>
    public Guid ProposedAdminId { get; set; }



    // ==========================
    // Request Owner
    // ==========================

    /// <summary>
    /// کاربری که درخواست را ثبت کرده است
    /// </summary>
    public Guid RequestedByUserId { get; set; }



    // ==========================
    // Request Information
    // ==========================

    /// <summary>
    /// دلیل درخواست تغییر مدیر
    /// </summary>
    public string Reason { get; set; }
        = string.Empty;


    /// <summary>
    /// شماره نامه رسمی شرکت
    /// </summary>
    public string? ReferenceNumber { get; set; }


    /// <summary>
    /// مسیر فایل سند درخواست
    /// </summary>
    public string? DocumentPath { get; set; }


    /// <summary>
    /// شناسه سند در Document Management
    /// </summary>
    public Guid? DocumentId { get; set; }



    // ==========================
    // Workflow
    // ==========================

    /// <summary>
    /// وضعیت گردش کار درخواست
    /// </summary>
    public CompanyAdminRequestStatus Status { get; set; }
        = CompanyAdminRequestStatus.Pending;



    /// <summary>
    /// توضیحات بررسی توسط Super Admin
    /// </summary>
    public string? ReviewComment { get; set; }


    /// <summary>
    /// کاربری که درخواست را بررسی کرده است
    /// </summary>
    public Guid? ReviewedByUserId { get; set; }


    /// <summary>
    /// زمان بررسی درخواست
    /// </summary>
    public DateTime? ReviewedAt { get; set; }



    // ==========================
    // Execution
    // ==========================

    /// <summary>
    /// آیا تغییر مدیر اجرا شده است؟
    /// </summary>
    public bool IsExecuted { get; set; }
        = false;


    /// <summary>
    /// زمان اجرای تغییر
    /// </summary>
    public DateTime? ExecutedAt { get; set; }


    /// <summary>
    /// کاربری که تغییر را اجرا کرده است
    /// </summary>
    public Guid? ExecutedByUserId { get; set; }



    // ==========================
    // Navigation Properties
    // ==========================

    public Company Company { get; set; }
        = null!;


    public User? CurrentAdmin { get; set; }


    public User ProposedAdmin { get; set; }
        = null!;


    public User RequestedByUser { get; set; }
        = null!;


    public User? ReviewedByUser { get; set; }


    public User? ExecutedByUser { get; set; }
}