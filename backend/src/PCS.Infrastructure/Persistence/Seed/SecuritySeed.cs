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
            dbPermissions);

        await EnsureInitialAdministratorAsync(
            context,
            configuration,
            passwordHasher,
            dbRoles);
    }


    // ============================================================
    // Roles
    // ============================================================

    private static async Task SynchronizeRolesAsync(
        DbContext context)
    {
        var roleSet = context.Set<Role>();

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

                continue;
            }

            role.Code =
                definition.Code;

            role.Name =
                definition.Name;

            role.Description =
                definition.Description;

            role.Scope =
                definition.Scope;

            role.IsSystemRole =
                definition.IsSystemRole;

            role.IsActive =
                definition.IsActive;
        }

        await context.SaveChangesAsync();
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

            permission.IsSystemPermission =
                definition.IsSystemPermission;

            permission.IsActive =
                definition.IsActive;
        }

        await context.SaveChangesAsync();
    }


    // ============================================================
    // Role Permissions
    // ============================================================

    private static async Task SynchronizeRolePermissionsAsync(
        DbContext context,
        IReadOnlyDictionary<string, Role> dbRoles,
        IReadOnlyDictionary<string, Permission> dbPermissions)
    {
        var rolePermissionSet =
            context.Set<RolePermission>();

        foreach (var definition in RolePermissionDefinitions)
        {
            if (!dbRoles.TryGetValue(
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

        if (string.IsNullOrWhiteSpace(
                initialAdmin.Username))
        {
            throw new InvalidOperationException(
                "PCS initial administrator username is not configured.");
        }

        if (string.IsNullOrWhiteSpace(
                initialAdmin.Password))
        {
            throw new InvalidOperationException(
                "PCS initial administrator password is not configured.");
        }

        if (initialAdmin.Password.Length < 8)
        {
            throw new InvalidOperationException(
                "PCS initial administrator password must contain at least 8 characters.");
        }

        string normalizedUsername =
            initialAdmin.Username.Trim();

        var userSet =
            context.Set<User>();

        var existingUser =
            await userSet
                .SingleOrDefaultAsync(
                    x =>
                        x.UserName == normalizedUsername);

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

            await userSet.AddAsync(
                adminUser);

            await context.SaveChangesAsync();
        }
        else
        {
            // ====================================================
            // Existing administrator
            //
            // SECURITY:
            // Never overwrite the existing password.
            // Never reset MustChangePassword automatically.
            // ====================================================

            adminUser =
                existingUser;

            bool changed =
                false;

            if (!adminUser.IsActive)
            {
                adminUser.IsActive =
                    true;

                changed = true;
            }

            if (!adminUser.IsSystemUser)
            {
                adminUser.IsSystemUser =
                    true;

                changed = true;
            }

            if (changed)
            {
                await context.SaveChangesAsync();
            }
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

        var userRoleSet =
            context.Set<UserRole>();

        var existingUserRole =
            await userRoleSet
                .SingleOrDefaultAsync(
                    x =>
                        x.UserId == adminUser.Id &&
                        x.RoleId == superAdminRole.Id);

        if (existingUserRole == null)
        {
            await userRoleSet.AddAsync(
                new UserRole
                {
                    UserId =
                        adminUser.Id,

                    RoleId =
                        superAdminRole.Id,

                    // SUPER_ADMIN is a Platform role.
                    CompanyId =
                        null,

                    AssignedAt =
                        DateTime.UtcNow,

                    AssignedByUserId =
                        null,

                    IsActive =
                        true
                });

            await context.SaveChangesAsync();

            return;
        }

        bool userRoleChanged =
            false;

        if (existingUserRole.CompanyId != null)
        {
            existingUserRole.CompanyId =
                null;

            userRoleChanged = true;
        }

        if (!existingUserRole.IsActive)
        {
            existingUserRole.IsActive =
                true;

            userRoleChanged = true;
        }

        if (userRoleChanged)
        {
            await context.SaveChangesAsync();
        }
    }
}