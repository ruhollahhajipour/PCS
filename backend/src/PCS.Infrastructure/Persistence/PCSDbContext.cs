using Microsoft.EntityFrameworkCore;

using PCS.Domain.Entities;
using PCS.Domain.Entities.Licensing;
using PCS.Domain.Entities.Planning;
using PCS.Domain.Entities.Security;
using PCS.Application.Common.Interfaces;

namespace PCS.Infrastructure.Persistence;

public class PCSDbContext : DbContext
{
    private readonly ICurrentTenant? _currentTenant;

    public PCSDbContext(
        DbContextOptions<PCSDbContext> options,
        ICurrentTenant? currentTenant = null)
        : base(options)
    {
        _currentTenant = currentTenant;
    }

    private Guid? CurrentCompanyId => _currentTenant?.CompanyId;
    private Guid? CurrentUserId => _currentTenant?.UserId;

    private bool IsGlobalTenantScope =>
        _currentTenant?.IsPlatformAdmin == true &&
        !CurrentCompanyId.HasValue;


    // ==========================
    // Core
    // ==========================

    public DbSet<Company> Companies
        => Set<Company>();

    public DbSet<Plant> Plants
        => Set<Plant>();

    public DbSet<Project> Projects
        => Set<Project>();


    // ==========================
    // Licensing
    // ==========================

    public DbSet<License> Licenses
        => Set<License>();

    public DbSet<LicenseModule> LicenseModules
        => Set<LicenseModule>();


    // ==========================
    // Identity & Security
    // ==========================

    public DbSet<User> Users
        => Set<User>();

    public DbSet<PasswordResetToken> PasswordResetTokens
        => Set<PasswordResetToken>();

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

    public DbSet<ProjectBaselineActivity> ProjectBaselineActivities
        => Set<ProjectBaselineActivity>();

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

        string primaryAdminFilter =
            Database.IsSqlite()
                ? "\"IsPrimaryAdmin\" = 1 AND \"IsActive\" = 1"
                : "[IsPrimaryAdmin] = 1 AND [IsActive] = 1";

        modelBuilder.Entity<CompanyUser>()
            .HasIndex(x => new
            {
                x.CompanyId,
                x.IsPrimaryAdmin
            })
            .HasFilter(primaryAdminFilter)
            .IsUnique();


        // ===================================
        // Unique Username
        // ===================================

        modelBuilder.Entity<User>()
            .HasIndex(x => x.UserName)
            .IsUnique();

        modelBuilder.Entity<Plant>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<Project>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<UserRole>()
            .HasQueryFilter(x =>
                x.CompanyId == null ||
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<CompanyAdminRequest>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<License>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<LicenseModule>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.License.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<AuditLog>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<Notification>()
            .HasQueryFilter(x =>
                CurrentUserId.HasValue &&
                x.UserId == CurrentUserId.Value);

        // PMS records inherit the scope of their owning project.
        modelBuilder.Entity<WbsNode>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Project.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<Activity>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Project.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<ActivityRelationship>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Predecessor.Project.CompanyId == CurrentCompanyId.Value &&
                 x.Successor.Project.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<ProjectBaseline>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Project.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<ProjectBaselineActivity>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.ProjectBaseline.Project.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<ProjectCalendar>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Project.CompanyId == CurrentCompanyId.Value));

        modelBuilder.Entity<ProgressEntry>()
            .HasQueryFilter(x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Activity.Project.CompanyId == CurrentCompanyId.Value));
    }
}