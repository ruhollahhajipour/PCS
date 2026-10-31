using System.Security.Claims;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.API.Security;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using Xunit;

namespace PCS.API.Tests.Security;

public sealed class ProjectAccessGuardTests
{
    [Fact]
    public async Task CompanyMember_CanAccessOwnProject_ButNotAnotherCompanyProject()
    {
        await using var fixture = await Fixture.CreateAsync();
        var principal = fixture.Principal(fixture.MemberUser.Id);

        Assert.True(await fixture.Guard.CanAccessProjectAsync(
            principal, fixture.ProjectA.Id));
        Assert.False(await fixture.Guard.CanAccessProjectAsync(
            principal, fixture.ProjectB.Id));
    }

    [Fact]
    public async Task CompanyMember_CannotAccessForeignActivityOrWbs()
    {
        await using var fixture = await Fixture.CreateAsync();
        var principal = fixture.Principal(fixture.MemberUser.Id);

        Assert.True(await fixture.Guard.CanAccessActivityAsync(
            principal, fixture.ActivityA.Id));
        Assert.False(await fixture.Guard.CanAccessActivityAsync(
            principal, fixture.ActivityB.Id));

        Assert.True(await fixture.Guard.CanAccessWbsAsync(
            principal, fixture.WbsA.Id));
        Assert.False(await fixture.Guard.CanAccessWbsAsync(
            principal, fixture.WbsB.Id));
    }

    [Fact]
    public async Task InactiveCompanyMembership_RevokesProjectAccess()
    {
        await using var fixture = await Fixture.CreateAsync();
        fixture.MembershipA.IsActive = false;
        await fixture.Db.SaveChangesAsync();

        var principal = fixture.Principal(fixture.MemberUser.Id);

        Assert.False(await fixture.Guard.CanAccessCompanyAsync(
            principal, fixture.CompanyA.Id));
        Assert.False(await fixture.Guard.CanAccessProjectAsync(
            principal, fixture.ProjectA.Id));
    }

    [Fact]
    public async Task InactiveUser_CannotAccessAnyCompanyResource()
    {
        await using var fixture = await Fixture.CreateAsync();
        fixture.MemberUser.IsActive = false;
        await fixture.Db.SaveChangesAsync();

        var principal = fixture.Principal(fixture.MemberUser.Id);

        Assert.False(await fixture.Guard.CanAccessProjectAsync(
            principal, fixture.ProjectA.Id));
        Assert.Empty(await fixture.Guard.GetAccessibleCompanyIdsAsync(principal));
    }

    [Fact]
    public async Task CompanyMember_ReceivesOnlyCompaniesWithActiveMembership()
    {
        await using var fixture = await Fixture.CreateAsync();
        var principal = fixture.Principal(fixture.MemberUser.Id);

        var companyIds = await fixture.Guard.GetAccessibleCompanyIdsAsync(principal);

        Assert.Equal(new[] { fixture.CompanyA.Id }, companyIds);
    }

    [Fact]
    public async Task SystemUser_CanAccessResourcesAcrossActiveCompanies()
    {
        await using var fixture = await Fixture.CreateAsync();
        var principal = fixture.Principal(fixture.SystemUser.Id);

        Assert.True(await fixture.Guard.IsSystemUserAsync(principal));
        Assert.True(await fixture.Guard.CanAccessProjectAsync(
            principal, fixture.ProjectA.Id));
        Assert.True(await fixture.Guard.CanAccessProjectAsync(
            principal, fixture.ProjectB.Id));
    }

    [Fact]
    public async Task PlantAccess_RequiresMembershipAndExpectedCompanyMatch()
    {
        await using var fixture = await Fixture.CreateAsync();
        var principal = fixture.Principal(fixture.MemberUser.Id);

        Assert.True(await fixture.Guard.CanAccessPlantAsync(
            principal, fixture.PlantA.Id, fixture.CompanyA.Id));
        Assert.False(await fixture.Guard.CanAccessPlantAsync(
            principal, fixture.PlantB.Id, fixture.CompanyA.Id));
        Assert.False(await fixture.Guard.CanAccessPlantAsync(
            principal, fixture.PlantB.Id, fixture.CompanyB.Id));
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        public PCSDbContext Db { get; }
        public ProjectAccessGuard Guard { get; }

        public User MemberUser { get; } = new()
        {
            UserName = "tenant.member",
            IsActive = true
        };

        public User SystemUser { get; } = new()
        {
            UserName = "tenant.system",
            IsActive = true,
            IsSystemUser = true
        };

        public Company CompanyA { get; } = new()
        {
            Code = "TENANT-A",
            Name = "Tenant A",
            IsActive = true
        };

        public Company CompanyB { get; } = new()
        {
            Code = "TENANT-B",
            Name = "Tenant B",
            IsActive = true
        };

        public CompanyUser MembershipA { get; private set; } = null!;
        public Project ProjectA { get; private set; } = null!;
        public Project ProjectB { get; private set; } = null!;
        public Plant PlantA { get; private set; } = null!;
        public Plant PlantB { get; private set; } = null!;
        public WbsNode WbsA { get; private set; } = null!;
        public WbsNode WbsB { get; private set; } = null!;
        public Activity ActivityA { get; private set; } = null!;
        public Activity ActivityB { get; private set; } = null!;

        private Fixture(SqliteConnection connection, PCSDbContext db)
        {
            _connection = connection;
            Db = db;
            Guard = new ProjectAccessGuard(db);
        }

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();

            var options = new DbContextOptionsBuilder<PCSDbContext>()
                .UseSqlite(connection)
                .Options;

            var db = new PCSDbContext(options);
            await db.Database.EnsureCreatedAsync();

            var fixture = new Fixture(connection, db);
            fixture.Seed();
            await db.SaveChangesAsync();
            return fixture;
        }

        private void Seed()
        {
            MembershipA = new CompanyUser
            {
                CompanyId = CompanyA.Id,
                UserId = MemberUser.Id,
                Company = CompanyA,
                User = MemberUser,
                IsActive = true
            };

            CompanyA.Users.Add(MembershipA);
            MemberUser.Companies.Add(MembershipA);

            ProjectA = new Project
            {
                Code = "PROJECT-A",
                Name = "Project A",
                CompanyId = CompanyA.Id,
                Company = CompanyA
            };

            ProjectB = new Project
            {
                Code = "PROJECT-B",
                Name = "Project B",
                CompanyId = CompanyB.Id,
                Company = CompanyB
            };

            PlantA = new Plant
            {
                Code = "PLANT-A",
                Name = "Plant A",
                CompanyId = CompanyA.Id,
                Company = CompanyA
            };

            PlantB = new Plant
            {
                Code = "PLANT-B",
                Name = "Plant B",
                CompanyId = CompanyB.Id,
                Company = CompanyB
            };

            WbsA = new WbsNode
            {
                Code = "01",
                Name = "WBS A",
                ProjectId = ProjectA.Id,
                Project = ProjectA
            };

            WbsB = new WbsNode
            {
                Code = "01",
                Name = "WBS B",
                ProjectId = ProjectB.Id,
                Project = ProjectB
            };

            ActivityA = new Activity
            {
                Code = "ACT-A",
                Name = "Activity A",
                ProjectId = ProjectA.Id,
                Project = ProjectA,
                WbsNodeId = WbsA.Id,
                WbsNode = WbsA
            };

            ActivityB = new Activity
            {
                Code = "ACT-B",
                Name = "Activity B",
                ProjectId = ProjectB.Id,
                Project = ProjectB,
                WbsNodeId = WbsB.Id,
                WbsNode = WbsB
            };

            Db.AddRange(
                CompanyA, CompanyB,
                MemberUser, SystemUser,
                ProjectA, ProjectB,
                PlantA, PlantB,
                WbsA, WbsB,
                ActivityA, ActivityB);
        }

        public ClaimsPrincipal Principal(Guid userId) =>
            new(new ClaimsIdentity(
                [new Claim(ClaimTypes.NameIdentifier, userId.ToString())],
                authenticationType: "test"));

        public async ValueTask DisposeAsync()
        {
            await Db.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }
}
