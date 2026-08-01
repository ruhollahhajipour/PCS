using PCS.Domain.Common;
using PCS.Domain.Entities.Security;

namespace PCS.Domain.Entities;

public class Company : AuditableEntity
{
    public string Code { get; set; } = string.Empty;


    public string Name { get; set; } = string.Empty;


    public string? NationalId { get; set; }


    public string? Address { get; set; }


    public string? Phone { get; set; }


    public string? Email { get; set; }


    /// <summary>
    /// وضعیت فعال بودن شرکت در پلتفرم PCS
    /// </summary>
    public bool IsActive { get; set; } = true;


    /// <summary>
    /// کاربران عضو این شرکت
    /// شامل مدیر شرکت، کاربران عملیاتی و سایر نقش‌ها
    /// </summary>
    public ICollection<CompanyUser> Users { get; set; } = new List<CompanyUser>();


    /// <summary>
    /// درخواست‌های مدیریتی شرکت
    /// مانند تغییر مدیر اصلی شرکت
    /// </summary>
    public ICollection<CompanyAdminRequest> AdminRequests { get; set; } = new List<CompanyAdminRequest>();
}