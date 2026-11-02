using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Services.Identity;

namespace PCS.Application.Tests.Security;

public sealed class AuthServiceSoftDeleteTests
{
    [Fact]
    public async Task Soft_deleted_user_cannot_login_read_current_user_or_change_password()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var hasher = new TestPasswordHasher();
        var company = new Company
        {
            Id = Guid.NewGuid(),
            Code = "AUTH-USER",
            Name = "Auth Test Company",
            IsActive = true
        };
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "deleted-user",
            PasswordHash = hasher.Hash("correct-password"),
            IsActive = true,
            IsDeleted = true
        };
        var membership = new CompanyUser
        {
            Id = Guid.NewGuid(),
            CompanyId = company.Id,
            UserId = user.Id,
            IsActive = true
        };

        dbContext.AddRange(company, user, membership);
        await dbContext.SaveChangesAsync();

        var authService = new AuthService(
            dbContext,
            hasher,
            new TestJwtService());

        Assert.Null(await authService.LoginAsync(new LoginRequest
        {
            Username = user.UserName,
            Password = "correct-password"
        }));

        Assert.Null(await authService.GetCurrentUserAsync(user.Id, company.Id));

        Assert.False(await authService.ChangePasswordAsync(
            user.Id,
            new ChangePasswordRequest
            {
                CurrentPassword = "correct-password",
                NewPassword = "new-password-123"
            }));
    }

    [Fact]
    public async Task Soft_deleted_membership_cannot_grant_company_access()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var hasher = new TestPasswordHasher();
        var company = new Company
        {
            Id = Guid.NewGuid(),
            Code = "AUTH-MEMBERSHIP",
            Name = "Membership Test Company",
            IsActive = true
        };
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "active-user",
            PasswordHash = hasher.Hash("correct-password"),
            IsActive = true
        };
        var membership = new CompanyUser
        {
            Id = Guid.NewGuid(),
            CompanyId = company.Id,
            UserId = user.Id,
            IsActive = true,
            IsDeleted = true
        };

        dbContext.AddRange(company, user, membership);
        await dbContext.SaveChangesAsync();

        var authService = new AuthService(
            dbContext,
            hasher,
            new TestJwtService());

        Assert.Null(await authService.LoginAsync(new LoginRequest
        {
            Username = user.UserName,
            Password = "correct-password"
        }));

        Assert.Null(await authService.SelectCompanyAsync(user.Id, company.Id));
        Assert.Null(await authService.GetCurrentUserAsync(user.Id, company.Id));
    }

    private sealed class TestPasswordHasher : IPasswordHasher
    {
        public string Hash(string password) => $"test-hash:{password}";

        public bool Verify(string password, string hash) =>
            string.Equals(Hash(password), hash, StringComparison.Ordinal);
    }

    private sealed class TestJwtService : IJwtService
    {
        public string GenerateToken(
            Guid userId,
            string username,
            IEnumerable<string> roles,
            IEnumerable<string> permissions,
            Guid? companyId,
            bool isPlatformAdmin) => "test-token";
    }
}
