using Microsoft.EntityFrameworkCore;
using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Persistence.Seed;

public static class SecuritySeed
{
    public static async Task SeedAsync(
        DbContext context)
    {
        // ==========================
        // Roles
        // ==========================

        var roles = new[]
        {
            new Role
            {
                Id = Guid.NewGuid(),
                Name = "SuperAdmin",
                Description =
                    "مدیر کل سامانه PCS با دسترسی کامل"
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Name = "CompanyAdmin",
                Description =
                    "مدیر اصلی شرکت مشتری"
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Name = "ProjectManager",
                Description =
                    "مدیر پروژه"
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Name = "CostController",
                Description =
                    "کنترلر هزینه پروژه"
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Name = "DocumentManager",
                Description =
                    "مدیر اسناد"
            },

            new Role
            {
                Id = Guid.NewGuid(),
                Name = "Viewer",
                Description =
                    "فقط مشاهده اطلاعات"
            }
        };


        foreach (var role in roles)
        {
            var exists =
                await context.Set<Role>()
                    .AnyAsync(x => x.Name == role.Name);


            if (!exists)
            {
                await context.Set<Role>()
                    .AddAsync(role);
            }
        }


        await context.SaveChangesAsync();



        // ==========================
        // Permissions
        // ==========================

        var permissions = new[]
        {
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "SECURITY_USERS_MANAGE",
                Name = "مدیریت کاربران",
                Module = "Security",
                Description =
                    "ایجاد، ویرایش و غیرفعال کردن کاربران",
                IsSystemPermission = true
            },


            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "SECURITY_ROLES_MANAGE",
                Name = "مدیریت نقش‌ها",
                Module = "Security",
                Description =
                    "مدیریت Role و Permission",
                IsSystemPermission = true
            },


            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "COMPANY_ADMIN_CHANGE",
                Name = "تغییر مدیر شرکت",
                Module = "Company",
                Description =
                    "تغییر Company Administrator",
                IsSystemPermission = true
            },


            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "COMPANY_USERS_MANAGE",
                Name = "مدیریت کاربران شرکت",
                Module = "Company",
                Description =
                    "مدیریت کاربران سازمان",
                IsSystemPermission = true
            },


            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "PMS_PROJECT_VIEW",
                Name = "مشاهده پروژه",
                Module = "PMS",
                Description =
                    "مشاهده اطلاعات پروژه",
                IsSystemPermission = true
            },


            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "PMS_PROJECT_EDIT",
                Name = "ویرایش پروژه",
                Module = "PMS",
                Description =
                    "ویرایش اطلاعات پروژه",
                IsSystemPermission = true
            },


            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "COST_CONTROL_VIEW",
                Name = "مشاهده کنترل هزینه",
                Module = "CostControl",
                Description =
                    "گزارشات هزینه",
                IsSystemPermission = true
            },


            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "DOCUMENT_APPROVE",
                Name = "تایید سند",
                Module = "Document",
                Description =
                    "تایید اسناد",
                IsSystemPermission = true
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
    }
}