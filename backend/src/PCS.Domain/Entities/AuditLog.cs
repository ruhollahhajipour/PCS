using PCS.Domain.Common;

namespace PCS.Domain.Entities;

public class AuditLog : BaseEntity
{
    /// <summary>
    /// کاربری که عملیات را انجام داده است
    /// </summary>
    public Guid? UserId { get; set; }


    /// <summary>
    /// نام کاربر در زمان ثبت لاگ
    /// برای حفظ تاریخچه حتی در صورت حذف کاربر
    /// </summary>
    public string Username { get; set; } = string.Empty;


    /// <summary>
    /// شرکت مربوط به عملیات
    /// برای پشتیبانی از Multi Tenant
    /// </summary>
    public Guid? CompanyId { get; set; }


    /// <summary>
    /// ماژول مربوط به عملیات
    /// مثال:
    /// Security
    /// CostControl
    /// Documents
    /// Projects
    /// </summary>
    public string Module { get; set; } = string.Empty;


    /// <summary>
    /// نام Entity تغییر یافته
    /// مثال:
    /// User
    /// CompanyAdminRequest
    /// Document
    /// </summary>
    public string Entity { get; set; } = string.Empty;


    /// <summary>
    /// شناسه رکورد تغییر یافته
    /// </summary>
    public string EntityId { get; set; } = string.Empty;


    /// <summary>
    /// نوع عملیات
    /// مثال:
    /// Create
    /// Update
    /// Delete
    /// Approve
    /// Reject
    /// Login
    /// </summary>
    public string Action { get; set; } = string.Empty;


    /// <summary>
    /// مقدار قبل از تغییر
    /// </summary>
    public string? OldValues { get; set; }


    /// <summary>
    /// مقدار بعد از تغییر
    /// </summary>
    public string? NewValues { get; set; }


    /// <summary>
    /// آدرس IP کاربر
    /// </summary>
    public string? IpAddress { get; set; }


    /// <summary>
    /// اطلاعات مرورگر یا دستگاه
    /// </summary>
    public string? UserAgent { get; set; }


    /// <summary>
    /// شناسه درخواست جهت Trace کردن عملیات
    /// </summary>
    public string? CorrelationId { get; set; }


    /// <summary>
    /// زمان ثبت رخداد
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}