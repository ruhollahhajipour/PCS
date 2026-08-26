using Microsoft.EntityFrameworkCore;
using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Persistence.Seed;

public static class SecuritySeed
{
    public static async Task SeedAsync(
        DbContext context)
    {
        // ============================================================
        // Roles
        // ============================================================

        var roles = new[]
        {
            new Role
            {
                Id = Guid.NewGuid(),
                Code = "SUPER_ADMIN",
                Name = "SuperAdmin",
                Description = "مدیر کل سامانه PCS با دسترسی کامل",
                Scope = "Platform",
                IsSystemRole = true,
                IsActive = true
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Code = "COMPANY_ADMIN",
                Name = "CompanyAdmin",
                Description = "مدیر اصلی شرکت مشتری",
                Scope = "Company",
                IsSystemRole = true,
                IsActive = true
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Code = "PROJECT_MANAGER",
                Name = "ProjectManager",
                Description = "مدیر پروژه",
                Scope = "Project",
                IsSystemRole = true,
                IsActive = true
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Code = "COST_CONTROLLER",
                Name = "CostController",
                Description = "کنترلر هزینه پروژه",
                Scope = "Project",
                IsSystemRole = true,
                IsActive = true
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Code = "DOCUMENT_MANAGER",
                Name = "DocumentManager",
                Description = "مدیر اسناد",
                Scope = "Company",
                IsSystemRole = true,
                IsActive = true
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Code = "VIEWER",
                Name = "Viewer",
                Description = "کاربر فقط برای مشاهده اطلاعات",
                Scope = "Company",
                IsSystemRole = true,
                IsActive = true
            }
        };


        foreach (var role in roles)
        {
            var exists =
                await context.Set<Role>()
                    .AnyAsync(x => x.Code == role.Code);

            if (!exists)
            {
                await context.Set<Role>()
                    .AddAsync(role);
            }
        }


        await context.SaveChangesAsync();


        // ============================================================
        // Permissions
        // ============================================================

        var permissions = new[]
        {
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "SECURITY_USERS_MANAGE",
                Name = "مدیریت کاربران",
                Module = "Security",
                Description = "ایجاد، ویرایش و غیرفعال کردن کاربران",
                IsSystemPermission = true,
                IsActive = true
            },

            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "SECURITY_ROLES_MANAGE",
                Name = "مدیریت نقش‌ها",
                Module = "Security",
                Description = "مدیریت Role و Permission",
                IsSystemPermission = true,
                IsActive = true
            },

            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "COMPANY_ADMIN_CHANGE",
                Name = "تغییر مدیر شرکت",
                Module = "Company",
                Description = "تغییر مدیر اصلی شرکت",
                IsSystemPermission = true,
                IsActive = true
            },

            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "COMPANY_USERS_MANAGE",
                Name = "مدیریت کاربران شرکت",
                Module = "Company",
                Description = "مدیریت کاربران سازمان",
                IsSystemPermission = true,
                IsActive = true
            },

            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "PMS_PROJECT_VIEW",
                Name = "مشاهده پروژه",
                Module = "PMS",
                Description = "مشاهده اطلاعات پروژه",
                IsSystemPermission = true,
                IsActive = true
            },

            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "PMS_PROJECT_EDIT",
                Name = "ویرایش پروژه",
                Module = "PMS",
                Description = "ویرایش اطلاعات پروژه",
                IsSystemPermission = true,
                IsActive = true
            },

            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "COST_CONTROL_VIEW",
                Name = "مشاهده کنترل هزینه",
                Module = "CostControl",
                Description = "مشاهده گزارش‌های هزینه",
                IsSystemPermission = true,
                IsActive = true
            },

            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "DOCUMENT_APPROVE",
                Name = "تأیید سند",
                Module = "Document",
                Description = "تأیید اسناد",
                IsSystemPermission = true,
                IsActive = true
            }
        };


        foreach (var permission in permissions)
        {
            var exists =
                await context.Set<Permission>()
                    .AnyAsync(x => x.Code == permission.Code);

            if (!exists)
            {
                await context.Set<Permission>()
                    .AddAsync(permission);
            }
        }


        await context.SaveChangesAsync();


        // ============================================================
        // Reload actual entities from database
        // ============================================================

        var dbRoles =
            await context.Set<Role>()
                .ToDictionaryAsync(
                    x => x.Code,
                    x => x);

        var dbPermissions =
            await context.Set<Permission>()
                .ToDictionaryAsync(
                    x => x.Code,
                    x => x);


        // ============================================================
        // Role Permissions
        // ============================================================

        var rolePermissions = new Dictionary<string, string[]>
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


        foreach (var rolePermission in rolePermissions)
        {
            if (!dbRoles.TryGetValue(
                    rolePermission.Key,
                    out var role))
            {
                continue;
            }


            foreach (var permissionCode in rolePermission.Value)
            {
                if (!dbPermissions.TryGetValue(
                        permissionCode,
                        out var permission))
                {
                    continue;
                }


                var exists =
                    await context.Set<RolePermission>()
                        .AnyAsync(x =>
                            x.RoleId == role.Id &&
                            x.PermissionId == permission.Id);


                if (!exists)
                {
                    await context.Set<RolePermission>()
                        .AddAsync(
                            new RolePermission
                            {
                                RoleId = role.Id,
                                PermissionId = permission.Id
                            });
                }
            }
        }


        await context.SaveChangesAsync();
    }
}