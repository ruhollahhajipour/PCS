using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
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
        await middleware.InvokeAsync(context, dbContext);

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
        await middleware.InvokeAsync(context, dbContext);

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
        await middleware.InvokeAsync(context, dbContext);

        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
        Assert.True(nextCalled);
        Assert.Equal(user.Id, context.Items["PCS.UserId"]);
        Assert.Equal(company.Id, context.Items["PCS.CompanyId"]);
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

    private static DefaultHttpContext CreateHttpContext(Guid userId, Guid companyId)
    {
        var identity = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim("company_id", companyId.ToString())
            ],
            authenticationType: "PCS-Test");

        return new DefaultHttpContext
        {
            User = new ClaimsPrincipal(identity)
        };
    }
}
