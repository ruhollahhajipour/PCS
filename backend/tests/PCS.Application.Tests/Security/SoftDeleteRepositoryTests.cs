using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Domain.Entities;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Repositories;

namespace PCS.Application.Tests.Security;

public sealed class SoftDeleteRepositoryTests
{
    [Fact]
    public async Task Global_query_filter_hides_soft_deleted_companies()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var deletedCompany = new Company
        {
            Id = Guid.NewGuid(),
            Code = "SOFT-DELETED",
            Name = "Soft Deleted Company",
            IsActive = false,
            IsDeleted = true,
            DeletedAt = DateTime.UtcNow
        };

        dbContext.Companies.Add(deletedCompany);
        await dbContext.SaveChangesAsync();

        Assert.False(await dbContext.Companies.AnyAsync(x => x.Id == deletedCompany.Id));
        Assert.True(await dbContext.Companies.IgnoreQueryFilters()
            .AnyAsync(x => x.Id == deletedCompany.Id));
    }

    [Fact]
    public async Task Generic_repository_delete_marks_auditable_entity_as_deleted()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var dbContext = new PCSDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        var company = new Company
        {
            Id = Guid.NewGuid(),
            Code = "SOFT-DELETE-REPOSITORY",
            Name = "Repository Soft Delete Company"
        };

        dbContext.Companies.Add(company);
        await dbContext.SaveChangesAsync();

        var repository = new GenericRepository<Company>(dbContext);
        repository.Delete(company);
        await repository.SaveChangesAsync();

        Assert.False(await dbContext.Companies.AnyAsync(x => x.Id == company.Id));

        var retainedRecord = await dbContext.Companies
            .IgnoreQueryFilters()
            .SingleAsync(x => x.Id == company.Id);

        Assert.True(retainedRecord.IsDeleted);
        Assert.NotNull(retainedRecord.DeletedAt);
    }
}
