using PCS.Domain.Common;

namespace PCS.Domain.Entities.Security;

public class Role : BaseEntity
{
    // ==========================
    // Identity
    // ==========================

    /// <summary>
    /// شناسه سیستمی Role
    /// مثال:
    /// SUPER_ADMIN
    /// COMPANY_ADMIN
    /// PROJECT_MANAGER
    /// </summary>
    public string Code { get; set; }
        = string.Empty;


    /// <summary>
    /// نام نمایشی Role
    /// </summary>
    public string Name { get; set; }
        = string.Empty;


    /// <summary>
    /// توضیحات نقش
    /// </summary>
    public string Description { get; set; }
        = string.Empty;



    // ==========================
    // Scope
    // ==========================

    /// <summary>
    /// محدوده دسترسی
    /// Platform:
    /// کل سیستم
    ///
    /// Company:
    /// یک شرکت
    ///
    /// Project:
    /// یک پروژه
    /// </summary>
    public string Scope { get; set; }
        = "Company";



    // ==========================
    // Control
    // ==========================

    /// <summary>
    /// Role های سیستمی قابل حذف نیستند
    /// </summary>
    public bool IsSystemRole { get; set; }
        = false;


    public bool IsActive { get; set; }
        = true;



    // ==========================
    // Navigation
    // ==========================

    public ICollection<UserRole> UserRoles { get; set; }
        = new List<UserRole>();


    public ICollection<RolePermission> RolePermissions { get; set; }
        = new List<RolePermission>();
}