using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;

namespace PCS.Application.Tests.Security;

public sealed class CompanyUserMembershipIndexTests
{
    [Fact]
    public async Task Soft_deleted_membership_does_not_block_a_new_membership_for_same_company_and_user()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var context = new PCSDbContext(options);
        await context.Database.EnsureCreatedAsync();

        var companyId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        context.AddRange(
            new Company
            {
                Id = companyId,
                Code = "MEMBERSHIP-INDEX",
                Name = "Membership Index Company"
            },
            new User
            {
                Id = userId,
                UserName = "membership-index-user",
                PasswordHash = "test-hash",
                FirstName = "Test",
                LastName = "User",
                Email = "membership-index@pcs.local"
            });

        context.CompanyUsers.Add(new CompanyUser
        {
            Id = Guid.NewGuid(),
            CompanyId = companyId,
            UserId = userId,
            IsDeleted = true,
            DeletedAt = DateTime.UtcNow,
            IsActive = false
        });

        context.CompanyUsers.Add(new CompanyUser
        {
            Id = Guid.NewGuid(),
            CompanyId = companyId,
            UserId = userId,
            IsActive = true
        });

        await context.SaveChangesAsync();

        context.CompanyUsers.Add(new CompanyUser
        {
            Id = Guid.NewGuid(),
            CompanyId = companyId,
            UserId = userId,
            IsActive = true
        });

        await Assert.ThrowsAsync<DbUpdateException>(
            () => context.SaveChangesAsync());
    }
}
