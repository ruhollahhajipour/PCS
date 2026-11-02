using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Persistence.Seed;

namespace PCS.Application.Tests.Security;

public sealed class SecuritySeedTests
{
    [Fact]
    public async Task Startup_seed_does_not_restore_revoked_security_state()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var context = new PCSDbContext(options);
        await context.Database.EnsureCreatedAsync();

        var configuration = CreateConfiguration();
        var passwordHasher = new TestPasswordHasher();

        await SecuritySeed.SeedAsync(context, configuration, passwordHasher);

        var admin = await context.Users
            .IgnoreQueryFilters()
            .SingleAsync(x => x.UserName == "bootstrap-admin");
        var superAdminRole = await context.Set<Role>()
            .SingleAsync(x => x.Code == "SUPER_ADMIN");
        var permission = await context.Set<Permission>()
            .SingleAsync(x => x.Code == "PMS_PROJECT_EDIT");
        var userRole = await context.Set<UserRole>()
            .SingleAsync(x => x.UserId == admin.Id && x.RoleId == superAdminRole.Id);
        var rolePermission = await context.Set<RolePermission>()
            .SingleAsync(x => x.RoleId == superAdminRole.Id && x.PermissionId == permission.Id);

        admin.IsActive = false;
        admin.IsDeleted = true;
        superAdminRole.IsActive = false;
        permission.IsActive = false;
        userRole.IsActive = false;
        context.Remove(rolePermission);
        await context.SaveChangesAsync();

        await SecuritySeed.SeedAsync(context, configuration, passwordHasher);

        var persistedAdmin = await context.Users
            .IgnoreQueryFilters()
            .SingleAsync(x => x.Id == admin.Id);
        var persistedRole = await context.Set<Role>()
            .SingleAsync(x => x.Id == superAdminRole.Id);
        var persistedPermission = await context.Set<Permission>()
            .SingleAsync(x => x.Id == permission.Id);
        var persistedUserRole = await context.Set<UserRole>()
            .SingleAsync(x => x.UserId == admin.Id && x.RoleId == superAdminRole.Id);

        Assert.False(persistedAdmin.IsActive);
        Assert.True(persistedAdmin.IsDeleted);
        Assert.False(persistedRole.IsActive);
        Assert.False(persistedPermission.IsActive);
        Assert.False(persistedUserRole.IsActive);
        Assert.False(await context.Set<RolePermission>()
            .AnyAsync(x => x.RoleId == superAdminRole.Id && x.PermissionId == permission.Id));
        Assert.Equal(1, await context.Users.IgnoreQueryFilters()
            .CountAsync(x => x.UserName == "bootstrap-admin"));
    }

    private static IConfiguration CreateConfiguration()
    {
        var values = new Dictionary<string, string?>
        {
            ["InitialAdmin:Username"] = "bootstrap-admin",
            ["InitialAdmin:Password"] = new string('x', 16),
            ["InitialAdmin:FirstName"] = "PCS",
            ["InitialAdmin:LastName"] = "Test Admin",
            ["InitialAdmin:Email"] = "admin-test@pcs.local"
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(values)
            .Build();
    }

    private sealed class TestPasswordHasher : IPasswordHasher
    {
        public string Hash(string password) => $"test-hash:{password}";

        public bool Verify(string password, string hash) =>
            hash == Hash(password);

        public bool NeedsRehash(string hash) => false;
    }
}
