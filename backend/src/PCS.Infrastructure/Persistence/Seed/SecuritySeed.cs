using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using PCS.Application.Identity;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Persistence.Seed;

public static class SecuritySeed
{
    // ============================================================
    // System Roles
    // ============================================================

    private sealed record RoleDefinition(
        string Code,
        string Name,
        string Description,
        string Scope,
        bool IsSystemRole,
        bool IsActive);

    private static readonly RoleDefinition[] RoleDefinitions =
    [
        new(
            "SUPER_ADMIN",
            "SuperAdmin",
            "مدیر کل سامانه PCS با دسترسی کامل",
            "Platform",
            true,
            true),

        new(
            "COMPANY_ADMIN",
            "CompanyAdmin",
            "مدیر اصلی شرکت مشتری",
            "Company",
            true,
            true),

        new(
            "PROJECT_MANAGER",
            "ProjectManager",
            "مدیر پروژه",
            "Project",
            true,
            true),

        new(
            "COST_CONTROLLER",
            "CostController",
            "کنترلر هزینه پروژه",
            "Project",
            true,
            true),

        new(
            "DOCUMENT_MANAGER",
            "DocumentManager",
            "مدیر اسناد",
            "Company",
            true,
            true),

        new(
            "VIEWER",
            "Viewer",
            "کاربر فقط برای مشاهده اطلاعات",
            "Company",
            true,
            true)
    ];


    // ============================================================
    // System Permissions
    // ============================================================

    private sealed record PermissionDefinition(
        string Code,
        string Name,
        string Module,
        string Description,
        bool IsSystemPermission,
        bool IsActive);

    private static readonly PermissionDefinition[] PermissionDefinitions =
    [
        new(
            "SECURITY_USERS_MANAGE",
            "مدیریت کاربران",
            "Security",
            "ایجاد، ویرایش و غیرفعال کردن کاربران",
            true,
            true),

        new(
            "SECURITY_ROLES_MANAGE",
            "مدیریت نقش‌ها",
            "Security",
            "مدیریت Role و Permission",
            true,
            true),

        new(
            "COMPANY_ADMIN_CHANGE",
            "تغییر مدیر شرکت",
            "Company",
            "تغییر مدیر اصلی شرکت",
            true,
            true),

        new(
            "COMPANY_USERS_MANAGE",
            "مدیریت کاربران شرکت",
            "Company",
            "مدیریت کاربران سازمان",
            true,
            true),

        new(
            "PMS_PROJECT_VIEW",
            "مشاهده پروژه",
            "PMS",
            "مشاهده اطلاعات پروژه",
            true,
            true),

        new(
            "PMS_PROJECT_EDIT",
            "ویرایش پروژه",
            "PMS",
            "ویرایش اطلاعات پروژه",
            true,
            true),

        new(
            "COST_CONTROL_VIEW",
            "مشاهده کنترل هزینه",
            "CostControl",
            "مشاهده گزارش‌های هزینه",
            true,
            true),

        new(
            "DOCUMENT_APPROVE",
            "تایید سند",
            "Document",
            "تایید اسناد",
            true,
            true)
    ];


    // ============================================================
    // Role -> Permission configuration
    // ============================================================

    private static readonly Dictionary<string, string[]> RolePermissionDefinitions =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["SUPER_ADMIN"] =
            [
                "SECURITY_USERS_MANAGE",
                "SECURITY_ROLES_MANAGE",
                "COMPANY_ADMIN_CHANGE",
                "COMPANY_USERS_MANAGE",
                "PMS_PROJECT_VIEW",
                "PMS_PROJECT_EDIT",
                "COST_CONTROL_VIEW",
                "DOCUMENT_APPROVE"
            ],

            ["COMPANY_ADMIN"] =
            [
                "SECURITY_USERS_MANAGE",
                "COMPANY_ADMIN_CHANGE",
                "COMPANY_USERS_MANAGE",
                "PMS_PROJECT_VIEW",
                "PMS_PROJECT_EDIT",
                "COST_CONTROL_VIEW",
                "DOCUMENT_APPROVE"
            ],

            ["PROJECT_MANAGER"] =
            [
                "PMS_PROJECT_VIEW",
                "PMS_PROJECT_EDIT",
                "COST_CONTROL_VIEW",
                "DOCUMENT_APPROVE"
            ],

            ["COST_CONTROLLER"] =
            [
                "PMS_PROJECT_VIEW",
                "COST_CONTROL_VIEW"
            ],

            ["DOCUMENT_MANAGER"] =
            [
                "PMS_PROJECT_VIEW",
                "DOCUMENT_APPROVE"
            ],

            ["VIEWER"] =
            [
                "PMS_PROJECT_VIEW",
                "COST_CONTROL_VIEW"
            ]
        };


    // ============================================================
    // Main entry point
    // ============================================================

    public static async Task SeedAsync(
        DbContext context,
        IConfiguration configuration,
        IPasswordHasher passwordHasher)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(configuration);
        ArgumentNullException.ThrowIfNull(passwordHasher);

        var newlyCreatedRoleCodes =
            await SynchronizeRolesAsync(context);

        await SynchronizePermissionsAsync(context);

        var dbRoles =
            await context.Set<Role>()
                .AsTracking()
                .ToDictionaryAsync(
                    x => x.Code,
                    x => x,
                    StringComparer.OrdinalIgnoreCase);

        var dbPermissions =
            await context.Set<Permission>()
                .AsTracking()
                .ToDictionaryAsync(
                    x => x.Code,
                    x => x,
                    StringComparer.OrdinalIgnoreCase);

        await SynchronizeRolePermissionsAsync(
            context,
            dbRoles,
            dbPermissions,
            newlyCreatedRoleCodes);

        await EnsureInitialAdministratorAsync(
            context,
            configuration,
            passwordHasher,
            dbRoles);
    }


    // ============================================================
    // Roles
    // ============================================================

    private static async Task<HashSet<string>> SynchronizeRolesAsync(
        DbContext context)
    {
        var roleSet = context.Set<Role>();
        var newlyCreatedRoleCodes =
            new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var definition in RoleDefinitions)
        {
            Role? role =
                await roleSet
                    .SingleOrDefaultAsync(
                        x => x.Code == definition.Code);

            if (role == null)
            {
                role =
                    await roleSet
                        .SingleOrDefaultAsync(
                            x => x.Name == definition.Name);
            }

            if (role == null)
            {
                role =
                    new Role
                    {
                        Id = Guid.NewGuid(),
                        Code = definition.Code,
                        Name = definition.Name,
                        Description = definition.Description,
                        Scope = definition.Scope,
                        IsSystemRole = definition.IsSystemRole,
                        IsActive = definition.IsActive
                    };

                await roleSet.AddAsync(role);
                newlyCreatedRoleCodes.Add(definition.Code);

                continue;
            }

            role.Code =
                definition.Code;

            role.Name =
                definition.Name;

            role.Description =
                definition.Description;

            // Preserve security-controlled state on existing roles.
            // Scope, IsSystemRole and IsActive must only change through
            // an explicit administrative operation.
        }

        await context.SaveChangesAsync();
        return newlyCreatedRoleCodes;
    }


    // ============================================================
    // Permissions
    // ============================================================

    private static async Task SynchronizePermissionsAsync(
        DbContext context)
    {
        var permissionSet =
            context.Set<Permission>();

        foreach (var definition in PermissionDefinitions)
        {
            Permission? permission =
                await permissionSet
                    .SingleOrDefaultAsync(
                        x => x.Code == definition.Code);

            if (permission == null)
            {
                permission =
                    new Permission
                    {
                        Id = Guid.NewGuid(),
                        Code = definition.Code,
                        Name = definition.Name,
                        Module = definition.Module,
                        Description = definition.Description,
                        IsSystemPermission =
                            definition.IsSystemPermission,
                        IsActive =
                            definition.IsActive
                    };

                await permissionSet.AddAsync(permission);

                continue;
            }

            permission.Code =
                definition.Code;

            permission.Name =
                definition.Name;

            permission.Module =
                definition.Module;

            permission.Description =
                definition.Description;

            // Preserve IsSystemPermission and IsActive. Seed must never
            // restore a permission that an administrator disabled.
        }

        await context.SaveChangesAsync();
    }


    // ============================================================
    // Role Permissions
    // ============================================================

    private static async Task SynchronizeRolePermissionsAsync(
        DbContext context,
        IReadOnlyDictionary<string, Role> dbRoles,
        IReadOnlyDictionary<string, Permission> dbPermissions,
        IReadOnlySet<string> newlyCreatedRoleCodes)
    {
        var rolePermissionSet =
            context.Set<RolePermission>();

        foreach (var definition in RolePermissionDefinitions)
        {
            // Default grants are applied only when a role is first created.
            // Re-running startup must not restore manually revoked grants.
            if (!newlyCreatedRoleCodes.Contains(definition.Key) ||
                !dbRoles.TryGetValue(
                    definition.Key,
                    out var role))
            {
                continue;
            }

            foreach (string permissionCode
                     in definition.Value)
            {
                if (!dbPermissions.TryGetValue(
                        permissionCode,
                        out var permission))
                {
                    continue;
                }

                bool exists =
                    await rolePermissionSet
                        .AnyAsync(
                            x =>
                                x.RoleId == role.Id &&
                                x.PermissionId == permission.Id);

                if (exists)
                {
                    continue;
                }

                await rolePermissionSet.AddAsync(
                    new RolePermission
                    {
                        RoleId =
                            role.Id,

                        PermissionId =
                            permission.Id
                    });
            }
        }

        await context.SaveChangesAsync();
    }


    // ============================================================
    // Initial Administrator
    // ============================================================

    private static async Task EnsureInitialAdministratorAsync(
        DbContext context,
        IConfiguration configuration,
        IPasswordHasher passwordHasher,
        IReadOnlyDictionary<string, Role> dbRoles)
    {
        var initialAdmin =
            configuration
                .GetSection(
                    InitialAdminSettings.SectionName)
                .Get<InitialAdminSettings>()
            ?? new InitialAdminSettings();

        string normalizedUsername =
            initialAdmin.Username?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(normalizedUsername))
        {
            throw new InvalidOperationException(
                "PCS initial administrator username is not configured.");
        }

        var userSet =
            context.Set<User>();

        var existingUser =
            await userSet
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(
                    x => x.UserName == normalizedUsername);

        bool createdInitialAdministrator = existingUser is null;

        // A configured bootstrap password is required only when
        // the initial administrator does not already exist.
        if (existingUser == null)
        {
            if (string.IsNullOrWhiteSpace(initialAdmin.Password))
            {
                throw new InvalidOperationException(
                    "PCS initial administrator password is not configured.");
            }

            if (initialAdmin.Password.Length < 12)
            {
                throw new InvalidOperationException(
                    "PCS initial administrator password must contain at least 12 characters.");
            }
        }

        User adminUser;

        // ========================================================
        // Create initial administrator
        // ========================================================

        if (existingUser == null)
        {
            adminUser =
                new User
                {
                    Id =
                        Guid.NewGuid(),

                    UserName =
                        normalizedUsername,

                    PasswordHash =
                        passwordHasher.Hash(
                            initialAdmin.Password),

                    // Initial administrator must change
                    // the installer-provided password.
                    MustChangePassword =
                        true,

                    FirstName =
                        initialAdmin.FirstName.Trim(),

                    LastName =
                        initialAdmin.LastName.Trim(),

                    Email =
                        initialAdmin.Email.Trim(),

                    IsActive =
                        true,

                    IsSystemUser =
                        true,

                    CreatedAt =
                        DateTime.UtcNow,

                    CreatedBy =
                        "SYSTEM"
                };

            await userSet.AddAsync(adminUser);
        }
        else
        {
            // Existing bootstrap accounts are intentionally left untouched.
            // In particular, never reactivate a disabled or soft-deleted user.
            adminUser = existingUser;
        }

        // ========================================================
        // Ensure SUPER_ADMIN role
        // ========================================================

        if (!dbRoles.TryGetValue(
                "SUPER_ADMIN",
                out var superAdminRole))
        {
            throw new InvalidOperationException(
                "PCS SUPER_ADMIN role was not found after security seed.");
        }

        if (!createdInitialAdministrator)
        {
            // Do not recreate a missing or revoked SUPER_ADMIN assignment
            // for an existing account. Recovery must be an explicit action.
            return;
        }

        if (!superAdminRole.IsActive ||
            !string.Equals(
                superAdminRole.Scope,
                "Platform",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "PCS SUPER_ADMIN role must be active and have Platform scope when bootstrapping the initial administrator.");
        }

        var userRoleSet = context.Set<UserRole>();
        await userRoleSet.AddAsync(
            new UserRole
            {
                UserId = adminUser.Id,
                RoleId = superAdminRole.Id,
                CompanyId = null,
                AssignedAt = DateTime.UtcNow,
                AssignedByUserId = null,
                IsActive = true
            });

        // Persist the new administrator and its initial role assignment
        // together so a partial bootstrap cannot strand the account.
        await context.SaveChangesAsync();
    }
}