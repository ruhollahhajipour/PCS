namespace PCS.Domain.Entities.Security;

public class UserRole
{
    // ==========================
    // User
    // ==========================

    public Guid UserId { get; set; }

    public User User { get; set; }
        = null!;



    // ==========================
    // Role
    // ==========================

    public Guid RoleId { get; set; }

    public Role Role { get; set; }
        = null!;



    // ==========================
    // Tenant Scope
    // ==========================

    /// <summary>
    /// شرکت مربوط به این نقش
    /// برای Roleهای Platform می‌تواند Null باشد
    /// </summary>
    public Guid? CompanyId { get; set; }


    public Company? Company { get; set; }



    // ==========================
    // Control
    // ==========================

    /// <summary>
    /// زمان اختصاص نقش
    /// </summary>
    public DateTime AssignedAt { get; set; }
        = DateTime.UtcNow;


    /// <summary>
    /// چه کسی این Role را اختصاص داده
    /// </summary>
    public Guid? AssignedByUserId { get; set; }


    public bool IsActive { get; set; }
        = true;
}