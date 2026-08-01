using PCS.Domain.Common;

namespace PCS.Domain.Entities.Security;

public class User : AuditableEntity
{
    /// <summary>
    /// نام کاربری ورود
    /// باید در کل سیستم یکتا باشد
    /// </summary>
    public string UserName { get; set; } = string.Empty;


    /// <summary>
    /// هش رمز عبور
    /// هرگز رمز خام ذخیره نمی‌شود
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;


    public string FirstName { get; set; } = string.Empty;


    public string LastName { get; set; } = string.Empty;


    public string Email { get; set; } = string.Empty;


    /// <summary>
    /// فعال یا غیرفعال بودن حساب
    /// </summary>
    public bool IsActive { get; set; } = true;


    /// <summary>
    /// مشخص می‌کند کاربر سیستم است یا کاربر یک شرکت
    /// </summary>
    public bool IsSystemUser { get; set; } = false;


    /// <summary>
    /// آخرین زمان ورود موفق
    /// </summary>
    public DateTime? LastLoginAt { get; set; }


    /// <summary>
    /// نقش‌های کاربر
    /// </summary>
    public ICollection<UserRole> UserRoles { get; set; }
        = new List<UserRole>();


    /// <summary>
    /// شرکت‌هایی که این کاربر به آن‌ها دسترسی دارد
    /// </summary>
    public ICollection<CompanyUser> Companies { get; set; }
        = new List<CompanyUser>();
}