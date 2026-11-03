using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using PCS.API.Middleware;

namespace PCS.Application.Tests.Security;

public sealed class TenantContextMiddlewareTests
{
    [Fact]
    public async Task Soft_deleted_user_is_rejected_even_with_active_membership()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var (user, company) = await SeedAsync(
            dbContext,
            userIsDeleted: true,
            membershipIsDeleted: false);

        bool nextCalled = false;
        var middleware = new TenantContextMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(user.Id, company.Id);
        await middleware.InvokeAsync(context, dbContext, new TestJwtService());

        Assert.Equal(StatusCodes.Status401Unauthorized, context.Response.StatusCode);
        Assert.False(nextCalled);
    }

    [Fact]
    public async Task Soft_deleted_membership_is_rejected_even_when_still_active()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var (user, company) = await SeedAsync(
            dbContext,
            userIsDeleted: false,
            membershipIsDeleted: true);

        bool nextCalled = false;
        var middleware = new TenantContextMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(user.Id, company.Id);
        await middleware.InvokeAsync(context, dbContext, new TestJwtService());

        Assert.Equal(StatusCodes.Status403Forbidden, context.Response.StatusCode);
        Assert.False(nextCalled);
    }

    [Fact]
    public async Task Active_user_with_active_membership_reaches_next_middleware()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var (user, company) = await SeedAsync(
            dbContext,
            userIsDeleted: false,
            membershipIsDeleted: false);

        bool nextCalled = false;
        var middleware = new TenantContextMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(user.Id, company.Id);
        await middleware.InvokeAsync(context, dbContext, new TestJwtService());

        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
        Assert.True(nextCalled);
        Assert.Equal(user.Id, context.Items["PCS.UserId"]);
        Assert.Equal(company.Id, context.Items["PCS.CompanyId"]);
    }

    [Fact]
    public async Task Platform_admin_can_access_inactive_company_but_not_deleted_company()
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
            UserName = "platform-admin",
            PasswordHash = "not-used",
            IsActive = true,
            IsSystemUser = true
        };
        var inactiveCompany = new Company
        {
            Id = Guid.NewGuid(),
            Code = "PLATFORM-INACTIVE",
            Name = "Inactive Company",
            IsActive = false
        };
        var deletedCompany = new Company
        {
            Id = Guid.NewGuid(),
            Code = "PLATFORM-DELETED",
            Name = "Deleted Company",
            IsActive = false,
            IsDeleted = true
        };

        var platformRole = new Role
        {
            Id = Guid.NewGuid(),
            Code = "SUPER_ADMIN",
            Name = "Platform Administrator",
            Scope = "Platform",
            IsActive = true,
            IsSystemRole = true
        };
        var platformAssignment = new UserRole
        {
            UserId = user.Id,
            RoleId = platformRole.Id,
            CompanyId = null,
            IsActive = true
        };

        dbContext.AddRange(
            user,
            platformRole,
            platformAssignment,
            inactiveCompany,
            deletedCompany);
        await dbContext.SaveChangesAsync();

        bool inactiveNextCalled = false;
        var inactiveMiddleware = new TenantContextMiddleware(_ =>
        {
            inactiveNextCalled = true;
            return Task.CompletedTask;
        });
        var inactiveContext = CreateHttpContext(
            user.Id,
            inactiveCompany.Id,
            isPlatformAdmin: true);

        await inactiveMiddleware.InvokeAsync(inactiveContext, dbContext, new TestJwtService());

        Assert.Equal(StatusCodes.Status200OK, inactiveContext.Response.StatusCode);
        Assert.True(inactiveNextCalled);

        bool deletedNextCalled = false;
        var deletedMiddleware = new TenantContextMiddleware(_ =>
        {
            deletedNextCalled = true;
            return Task.CompletedTask;
        });
        var deletedContext = CreateHttpContext(
            user.Id,
            deletedCompany.Id,
            isPlatformAdmin: true);

        await deletedMiddleware.InvokeAsync(deletedContext, dbContext, new TestJwtService());

        Assert.Equal(StatusCodes.Status404NotFound, deletedContext.Response.StatusCode);
        Assert.False(deletedNextCalled);
    }

    [Fact]
    public async Task Revoked_platform_admin_assignment_is_not_overridden_by_jwt_claim()
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
            UserName = "revoked-platform-admin",
            PasswordHash = "not-used",
            IsActive = true,
            IsSystemUser = true
        };
        var inactiveCompany = new Company
        {
            Id = Guid.NewGuid(),
            Code = "REVOKED-PLATFORM",
            Name = "Inactive Company",
            IsActive = false
        };

        dbContext.AddRange(user, inactiveCompany);
        await dbContext.SaveChangesAsync();

        bool nextCalled = false;
        var middleware = new TenantContextMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(
            user.Id,
            inactiveCompany.Id,
            isPlatformAdmin: true);

        await middleware.InvokeAsync(context, dbContext, new TestJwtService());

        Assert.Equal(StatusCodes.Status404NotFound, context.Response.StatusCode);
        Assert.False(nextCalled);
    }

    [Fact]
    public async Task Token_without_security_stamp_is_rejected()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var (user, company) = await SeedAsync(
            dbContext,
            userIsDeleted: false,
            membershipIsDeleted: false);

        bool nextCalled = false;
        var middleware = new TenantContextMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(
            user.Id,
            company.Id,
            securityStamp: null);

        await middleware.InvokeAsync(context, dbContext, new TestJwtService());

        Assert.Equal(StatusCodes.Status401Unauthorized, context.Response.StatusCode);
        Assert.False(nextCalled);
    }

    [Fact]
    public async Task Token_with_old_security_stamp_is_rejected_after_password_hash_changes()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var (user, company) = await SeedAsync(
            dbContext,
            userIsDeleted: false,
            membershipIsDeleted: false);

        user.PasswordHash = "new-password-hash";
        await dbContext.SaveChangesAsync();

        bool nextCalled = false;
        var middleware = new TenantContextMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(user.Id, company.Id);

        await middleware.InvokeAsync(context, dbContext, new TestJwtService());

        Assert.Equal(StatusCodes.Status401Unauthorized, context.Response.StatusCode);
        Assert.False(nextCalled);
    }

    private static async Task<(User User, Company Company)> SeedAsync(
        PCSDbContext dbContext,
        bool userIsDeleted,
        bool membershipIsDeleted)
    {
        var company = new Company
        {
            Id = Guid.NewGuid(),
            Code = $"TENANT-{Guid.NewGuid():N}",
            Name = "Tenant Middleware Test Company",
            IsActive = true
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = $"tenant-{Guid.NewGuid():N}",
            PasswordHash = "not-used",
            IsActive = true,
            IsDeleted = userIsDeleted
        };

        var membership = new CompanyUser
        {
            Id = Guid.NewGuid(),
            CompanyId = company.Id,
            UserId = user.Id,
            IsActive = true,
            IsDeleted = membershipIsDeleted
        };

        dbContext.AddRange(company, user, membership);
        await dbContext.SaveChangesAsync();

        return (user, company);
    }

    private sealed class TestJwtService : IJwtService
    {
        public string CreateSecurityStamp(string passwordHash) =>
            "test-security-stamp";

        public string GenerateToken(
            Guid userId,
            string username,
            IEnumerable<string> roles,
            IEnumerable<string> permissions,
            Guid? companyId,
            bool isPlatformAdmin,
            string securityStamp) => "test-token";
    }

    private static DefaultHttpContext CreateHttpContext(
        Guid userId,
        Guid companyId,
        bool isPlatformAdmin = false,
        string? securityStamp = "test-security-stamp")
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new("company_id", companyId.ToString())
        };

        if (!string.IsNullOrWhiteSpace(securityStamp))
        {
            claims.Add(new Claim("security_stamp", securityStamp));
        }

        if (isPlatformAdmin)
        {
            claims.Add(new Claim("platform_admin", "true"));
        }

        var identity = new ClaimsIdentity(
            claims,
            authenticationType: "PCS-Test");

        return new DefaultHttpContext
        {
            User = new ClaimsPrincipal(identity)
        };
    }
}
