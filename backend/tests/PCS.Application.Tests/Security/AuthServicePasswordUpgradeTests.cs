using System.Security.Cryptography;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Services.Identity;

namespace PCS.Application.Tests.Security;

public sealed class AuthServicePasswordUpgradeTests
{
    [Fact]
    public async Task Successful_login_rehashes_legacy_password_with_current_work_factor()
    {
        const string password = "Legacy-Password-For-Upgrade!";
        const int legacyIterations = 100_000;

        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        byte[] salt = RandomNumberGenerator.GetBytes(32);
        byte[] derivedKey = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            legacyIterations,
            HashAlgorithmName.SHA256,
            32);

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "legacy-password-user",
            PasswordHash = string.Join(
                "$",
                "PCS-PBKDF2-SHA256",
                legacyIterations,
                Convert.ToBase64String(salt),
                Convert.ToBase64String(derivedKey)),
            IsActive = true
        };
        var company = new Company
        {
            Id = Guid.NewGuid(),
            Code = "PASSWORD-UPGRADE",
            Name = "Password Upgrade Test Company",
            IsActive = true
        };
        var membership = new CompanyUser
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            CompanyId = company.Id,
            IsActive = true
        };

        dbContext.AddRange(user, company, membership);
        await dbContext.SaveChangesAsync();

        var hasher = new PasswordHasher();
        var authService = new AuthService(
            dbContext,
            hasher,
            new TestJwtService());

        var response = await authService.LoginAsync(new LoginRequest
        {
            Username = user.UserName,
            Password = password
        });

        Assert.NotNull(response);
        Assert.True(hasher.Verify(password, user.PasswordHash));
        Assert.False(hasher.NeedsRehash(user.PasswordHash));
        Assert.StartsWith("PCS-PBKDF2-SHA256$600000$", user.PasswordHash);
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
