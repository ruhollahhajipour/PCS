using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Common.Interfaces;
using PCS.Application.Common.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Repositories;

namespace PCS.Application.Tests.Security;

public sealed class TenantIsolationTests
{
    [Fact]
    public async Task Tenant_scope_filters_projects_plants_wbs_and_activities_including_key_lookups()
    {
        Guid companyAId = Guid.NewGuid();
        Guid companyBId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();

        await using var connection =
            new SqliteConnection("Data Source=:memory:");

        await connection.OpenAsync();

        var options =
            new DbContextOptionsBuilder<PCSDbContext>()
                .UseSqlite(connection)
                .Options;

        var companyA = new Company
        {
            Id = companyAId,
            Code = "A",
            Name = "Company A",
            IsActive = true
        };

        var companyB = new Company
        {
            Id = companyBId,
            Code = "B",
            Name = "Company B",
            IsActive = true
        };

        var plantA = new Plant
        {
            Id = Guid.NewGuid(),
            Code = "PA",
            Name = "Plant A",
            CompanyId = companyAId,
            Company = companyA,
            IsActive = true
        };

        var plantB = new Plant
        {
            Id = Guid.NewGuid(),
            Code = "PB",
            Name = "Plant B",
            CompanyId = companyBId,
            Company = companyB,
            IsActive = true
        };

        var projectA = new Project
        {
            Id = Guid.NewGuid(),
            Code = "P-A",
            Name = "Project A",
            CompanyId = companyAId,
            Company = companyA,
            PlantId = plantA.Id,
            Plant = plantA,
            StartDate = new DateOnly(2026, 1, 1),
            IsActive = true
        };

        var projectB = new Project
        {
            Id = Guid.NewGuid(),
            Code = "P-B",
            Name = "Project B",
            CompanyId = companyBId,
            Company = companyB,
            PlantId = plantB.Id,
            Plant = plantB,
            StartDate = new DateOnly(2026, 1, 1),
            IsActive = true
        };

        var wbsA = new WbsNode
        {
            Id = Guid.NewGuid(),
            ProjectId = projectA.Id,
            Project = projectA,
            Code = "A.1",
            Name = "WBS A"
        };

        var wbsB = new WbsNode
        {
            Id = Guid.NewGuid(),
            ProjectId = projectB.Id,
            Project = projectB,
            Code = "B.1",
            Name = "WBS B"
        };

        var activityA = new Activity
        {
            Id = Guid.NewGuid(),
            ProjectId = projectA.Id,
            Project = projectA,
            WbsNodeId = wbsA.Id,
            WbsNode = wbsA,
            Code = "A-001",
            Name = "Activity A"
        };

        var activityB = new Activity
        {
            Id = Guid.NewGuid(),
            ProjectId = projectB.Id,
            Project = projectB,
            WbsNodeId = wbsB.Id,
            WbsNode = wbsB,
            Code = "B-001",
            Name = "Activity B"
        };

        await using (var seedContext =
            new PCSDbContext(options, new TestTenant(null, true, userId)))
        {
            await seedContext.Database.EnsureCreatedAsync();

            seedContext.AddRange(
                companyA,
                companyB,
                plantA,
                plantB,
                projectA,
                projectB,
                wbsA,
                wbsB,
                activityA,
                activityB);

            await seedContext.SaveChangesAsync();
        }

        await using (var tenantContext =
            new PCSDbContext(
                options,
                new TestTenant(companyAId, false, userId)))
        {
            Assert.Single(await tenantContext.Plants.ToListAsync());
            Assert.Single(await tenantContext.Projects.ToListAsync());
            Assert.Single(await tenantContext.WbsNodes.ToListAsync());
            Assert.Single(await tenantContext.Activities.ToListAsync());

            Assert.Null(await tenantContext.Projects
                .SingleOrDefaultAsync(x => x.Id == projectB.Id));

            var projectRepository =
                new GenericRepository<Project>(tenantContext);

            Assert.Null(await projectRepository.GetByIdAsync(projectB.Id));
            Assert.NotNull(await projectRepository.GetByIdAsync(projectA.Id));
        }

        await using (var platformContext =
            new PCSDbContext(
                options,
                new TestTenant(null, true, userId)))
        {
            Assert.Equal(2, await platformContext.Projects.CountAsync());
            Assert.Equal(2, await platformContext.Activities.CountAsync());
        }
    }

    private sealed record TestTenant(
        Guid? CompanyId,
        bool IsPlatformAdmin,
        Guid? UserId) : ICurrentTenant
    {
        public bool IsGlobalScope =>
            IsPlatformAdmin && !CompanyId.HasValue;
    }
}
