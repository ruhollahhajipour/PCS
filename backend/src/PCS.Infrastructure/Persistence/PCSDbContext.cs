using Microsoft.EntityFrameworkCore;

using PCS.Domain.Entities;
using PCS.Domain.Entities.PMS;
using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Persistence;

public class PCSDbContext : DbContext
{
    public PCSDbContext(
        DbContextOptions<PCSDbContext> options)
        : base(options)
    {
    }


    // ==========================
    // Core
    // ==========================

    public DbSet<Company> Companies
        => Set<Company>();

    public DbSet<Project> Projects
        => Set<Project>();


    // ==========================
    // Identity & Security
    // ==========================

    public DbSet<User> Users
        => Set<User>();

    public DbSet<Role> Roles
        => Set<Role>();

    public DbSet<Permission> Permissions
        => Set<Permission>();

    public DbSet<UserRole> UserRoles
        => Set<UserRole>();

    public DbSet<RolePermission> RolePermissions
        => Set<RolePermission>();


    // ==========================
    // Company Administration
    // ==========================

    public DbSet<CompanyUser> CompanyUsers
        => Set<CompanyUser>();

    public DbSet<CompanyAdminRequest> CompanyAdminRequests
        => Set<CompanyAdminRequest>();


    // ==========================
    // Digital Signature
    // ==========================

    public DbSet<DigitalSignature> DigitalSignatures
        => Set<DigitalSignature>();


    // ==========================
    // Notifications & Audit
    // ==========================

    public DbSet<Notification> Notifications
        => Set<Notification>();

    public DbSet<AuditLog> AuditLogs
        => Set<AuditLog>();


    // ==========================
    // PMS
    // ==========================

    public DbSet<WbsNode> WbsNodes
        => Set<WbsNode>();

    public DbSet<Activity> Activities
        => Set<Activity>();

    public DbSet<ActivityRelationship> ActivityRelationships
        => Set<ActivityRelationship>();

    public DbSet<ProjectBaseline> ProjectBaselines
        => Set<ProjectBaseline>();

    public DbSet<ProjectCalendar> ProjectCalendars
        => Set<ProjectCalendar>();

    public DbSet<ProgressEntry> ProgressEntries
        => Set<ProgressEntry>();


    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(PCSDbContext).Assembly);


        // ===================================
        // Company Admin Rule
        // فقط یک Primary Admin برای هر شرکت
        // ===================================

        modelBuilder.Entity<CompanyUser>()
            .HasIndex(x => new
            {
                x.CompanyId,
                x.IsPrimaryAdmin
            })
            .HasFilter(
                "\"IsPrimaryAdmin\" = 1")
            .IsUnique();


        // ===================================
        // Unique Username
        // ===================================

        modelBuilder.Entity<User>()
            .HasIndex(x => x.UserName)
            .IsUnique();


        // ===================================
        // Unique Role Name
        // ===================================

        modelBuilder.Entity<Role>()
            .HasIndex(x => x.Name)
            .IsUnique();


       
    }
}