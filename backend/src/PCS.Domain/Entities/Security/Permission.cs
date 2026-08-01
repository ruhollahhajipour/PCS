using PCS.Domain.Common;

namespace PCS.Domain.Entities.Security;

public class Permission : BaseEntity
{
    public string Code { get; set; }
        = string.Empty;


    public string Name { get; set; }
        = string.Empty;


    public string Description { get; set; }
        = string.Empty;


    // ماژول مربوطه
    // مثال:
    // Security
    // CostControl
    // PMS
    // Document
    public string Module { get; set; }
        = string.Empty;


    public bool IsActive { get; set; }
        = true;


    // Permissionهای سیستمی توسط مشتری قابل حذف نیستند
    public bool IsSystemPermission { get; set; }
        = false;


    public ICollection<RolePermission> RolePermissions { get; set; }
        = new List<RolePermission>();
}