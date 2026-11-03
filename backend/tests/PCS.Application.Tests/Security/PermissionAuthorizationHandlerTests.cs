using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

using PCS.API.Security;
using PCS.Application.Common.Security;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;

namespace PCS.Application.Tests.Security;

public sealed class PermissionAuthorizationHandlerTests
{
    [Fact]
    public async Task Revoking_role_permission_takes_effect_without_reissuing_jwt()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var data = await SeedCompanyPermissionAsync(dbContext);

        Assert.True(await IsAuthorizedAsync(
            dbContext,
            data.User.Id,
            data.Company.Id));

        dbContext.Remove(data.RolePermission);
        await dbContext.SaveChangesAsync();

        Assert.False(await IsAuthorizedAsync(
            dbContext,
            data.User.Id,
            data.Company.Id));
    }

    [Fact]
    public async Task Inactive_role_or_permission_cannot_grant_access()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var data = await SeedCompanyPermissionAsync(dbContext);

        data.Role.IsActive = false;
        await dbContext.SaveChangesAsync();

        Assert.False(await IsAuthorizedAsync(
            dbContext,
            data.User.Id,
            data.Company.Id));

        data.Role.IsActive = true;
        data.Permission.IsActive = false;
        await dbContext.SaveChangesAsync();

        Assert.False(await IsAuthorizedAsync(
            dbContext,
            data.User.Id,
            data.Company.Id));
    }

    [Fact]
    public async Task Inactive_user_role_assignment_cannot_grant_access()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var data = await SeedCompanyPermissionAsync(dbContext);
        data.Assignment.IsActive = false;
        await dbContext.SaveChangesAsync();

        Assert.False(await IsAuthorizedAsync(
            dbContext,
            data.User.Id,
            data.Company.Id));
    }

    [Fact]
    public async Task Company_scoped_role_cannot_grant_access_in_another_company()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var data = await SeedCompanyPermissionAsync(dbContext);
        var otherCompany = new Company
        {
            Id = Guid.NewGuid(),
            Code = "AUTHZ-OTHER",
            Name = "Other Authorization Company",
            IsActive = true
        };

        dbContext.Companies.Add(otherCompany);
        await dbContext.SaveChangesAsync();

        Assert.False(await IsAuthorizedAsync(
            dbContext,
            data.User.Id,
            otherCompany.Id));
    }

    [Fact]
    public async Task Platform_role_requires_verified_platform_admin_context()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "platform-authz-user",
            PasswordHash = "not-used",
            IsActive = true
        };
        var role = new Role
        {
            Id = Guid.NewGuid(),
            Code = "SUPER_ADMIN",
            Name = "Platform Administrator",
            Scope = "Platform",
            IsActive = true
        };
        var permission = new Permission
        {
            Id = Guid.NewGuid(),
            Code = Permissions.ProjectEdit,
            Name = "Edit Projects",
            Module = "PMS",
            IsActive = true
        };
        var assignment = new UserRole
        {
            UserId = user.Id,
            RoleId = role.Id,
            CompanyId = null,
            IsActive = true
        };
        var rolePermission = new RolePermission
        {
            RoleId = role.Id,
            PermissionId = permission.Id
        };

        dbContext.AddRange(user, role, permission, assignment, rolePermission);
        await dbContext.SaveChangesAsync();

        Assert.False(await IsAuthorizedAsync(
            dbContext,
            user.Id,
            companyId: null,
            isPlatformAdmin: false));

        Assert.True(await IsAuthorizedAsync(
            dbContext,
            user.Id,
            companyId: null,
            isPlatformAdmin: true));
    }

    private static async Task<(User User, Company Company, Role Role, Permission Permission, UserRole Assignment, RolePermission RolePermission)>
        SeedCompanyPermissionAsync(PCSDbContext dbContext)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "company-authz-user",
            PasswordHash = "not-used",
            IsActive = true
        };
        var company = new Company
        {
            Id = Guid.NewGuid(),
            Code = "AUTHZ-COMPANY",
            Name = "Authorization Test Company",
            IsActive = true
        };
        var role = new Role
        {
            Id = Guid.NewGuid(),
            Code = "PROJECT_EDITOR",
            Name = "Project Editor",
            Scope = "Company",
            IsActive = true
        };
        var permission = new Permission
        {
            Id = Guid.NewGuid(),
            Code = Permissions.ProjectEdit,
            Name = "Edit Projects",
            Module = "PMS",
            IsActive = true
        };
        var assignment = new UserRole
        {
            UserId = user.Id,
            RoleId = role.Id,
            CompanyId = company.Id,
            IsActive = true
        };
        var rolePermission = new RolePermission
        {
            RoleId = role.Id,
            PermissionId = permission.Id
        };

        dbContext.AddRange(
            user,
            company,
            role,
            permission,
            assignment,
            rolePermission);

        await dbContext.SaveChangesAsync();

        return (user, company, role, permission, assignment, rolePermission);
    }

    private static async Task<bool> IsAuthorizedAsync(
        PCSDbContext dbContext,
        Guid userId,
        Guid? companyId,
        bool isPlatformAdmin = false)
    {
        var httpContext = new DefaultHttpContext();
        httpContext.User = new ClaimsPrincipal(
            new ClaimsIdentity(
                [new Claim(ClaimTypes.NameIdentifier, userId.ToString())],
                authenticationType: "PCS-Test"));

        httpContext.Items["PCS.UserId"] = userId;
        httpContext.Items["PCS.CompanyId"] = companyId;
        httpContext.Items["PCS.IsPlatformAdmin"] = isPlatformAdmin;

        var accessor = new HttpContextAccessor
        {
            HttpContext = httpContext
        };

        var handler = new PermissionAuthorizationHandler(
            dbContext,
            accessor);

        var requirement = new PermissionRequirement(Permissions.ProjectEdit);
        var authorizationContext = new AuthorizationHandlerContext(
            [requirement],
            httpContext.User,
            httpContext);

        await handler.HandleAsync(authorizationContext);
        return authorizationContext.HasSucceeded;
    }
}