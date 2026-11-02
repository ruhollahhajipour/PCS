using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

using PCS.Domain.Common;
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
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<Project>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<UserRole>()
            .HasQueryFilter("PCS.Tenant", x =>
                x.CompanyId == null ||
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<CompanyAdminRequest>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<License>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<LicenseModule>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.License.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<AuditLog>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<Notification>()
            .HasQueryFilter("PCS.Tenant", x =>
                CurrentUserId.HasValue &&
                x.UserId == CurrentUserId);

        modelBuilder.Entity<DigitalSignature>()
            .HasQueryFilter("PCS.Tenant", x =>
                CurrentUserId.HasValue &&
                x.UserId == CurrentUserId);

        // PMS records inherit the scope of their owning project.
        modelBuilder.Entity<WbsNode>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Project.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<Activity>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Project.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<ActivityRelationship>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Predecessor.Project.CompanyId == CurrentCompanyId &&
                 x.Successor.Project.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<ProjectBaseline>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Project.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<ProjectBaselineActivity>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.ProjectBaseline.Project.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<ProjectCalendar>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Project.CompanyId == CurrentCompanyId));

        modelBuilder.Entity<ProgressEntry>()
            .HasQueryFilter("PCS.Tenant", x =>
                IsGlobalTenantScope ||
                (CurrentCompanyId.HasValue &&
                 x.Activity.Project.CompanyId == CurrentCompanyId));

        ApplySoftDeleteFilters(modelBuilder);
    }

    private static void ApplySoftDeleteFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(AuditableEntity).IsAssignableFrom(entityType.ClrType))
            {
                continue;
            }

            var parameter = Expression.Parameter(entityType.ClrType, "entity");
            var filterBody = Expression.Not(
                Expression.Property(parameter, nameof(AuditableEntity.IsDeleted)));

            // EF Core 10 named filters compose with the existing tenant filter
            // instead of replacing it.
            modelBuilder.Entity(entityType.ClrType)
                .HasQueryFilter(
                    "PCS.SoftDelete",
                    Expression.Lambda(filterBody, parameter));
        }
    }
}