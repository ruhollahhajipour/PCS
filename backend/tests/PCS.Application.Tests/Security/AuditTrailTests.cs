using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Services;
using PCS.Infrastructure.Services.Identity;

namespace PCS.Application.Tests.Security;

public sealed class AuditTrailTests
{
    [Fact]
    public async Task Creating_a_project_writes_an_attributed_audit_row_in_the_same_save()
    {
        await using var connection = await OpenConnectionAsync();
        Guid companyId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();

        await using var context = await CreateContextAsync(
            connection,
            new TestTenant(companyId, false, userId),
            new TestAuditContext());

        await SeedCompanyAsync(context, companyId);

        var project = NewProject(companyId, "P-AUDIT-1", "Pipeline");
        context.Projects.Add(project);
        await context.SaveChangesAsync();

        var row = await context.AuditLogs
            .IgnoreQueryFilters()
            .SingleAsync(x => x.Entity == "Project" && x.EntityId == project.Id.ToString());

        Assert.Equal("Create", row.Action);
        Assert.Equal("Projects", row.Module);
        Assert.Equal(companyId, row.CompanyId);
        Assert.Equal(userId, row.UserId);
        Assert.Equal("alice", row.Username);
        Assert.Equal("10.0.0.7", row.IpAddress);
        Assert.Equal("corr-123", row.CorrelationId);
        Assert.Contains("Pipeline", row.NewValues);
    }

    [Fact]
    public async Task Updating_a_project_records_only_the_changed_properties()
    {
        await using var connection = await OpenConnectionAsync();
        Guid companyId = Guid.NewGuid();

        await using var context = await CreateContextAsync(
            connection,
            new TestTenant(companyId, false, Guid.NewGuid()),
            new TestAuditContext());

        await SeedCompanyAsync(context, companyId);

        var project = NewProject(companyId, "P-AUDIT-2", "Before");
        context.Projects.Add(project);
        await context.SaveChangesAsync();

        project.Name = "After";
        await context.SaveChangesAsync();

        var row = await context.AuditLogs
            .IgnoreQueryFilters()
            .SingleAsync(x => x.Entity == "Project" && x.Action == "Update");

        Assert.Contains("Before", row.OldValues);
        Assert.Contains("After", row.NewValues);
        Assert.DoesNotContain("\"Code\"", row.NewValues);
    }

    [Fact]
    public async Task Soft_deleting_a_project_is_recorded_as_a_delete()
    {
        await using var connection = await OpenConnectionAsync();
        Guid companyId = Guid.NewGuid();

        await using var context = await CreateContextAsync(
            connection,
            new TestTenant(companyId, false, Guid.NewGuid()),
            new TestAuditContext());

        await SeedCompanyAsync(context, companyId);

        var project = NewProject(companyId, "P-AUDIT-3", "Doomed");
        context.Projects.Add(project);
        await context.SaveChangesAsync();

        project.IsDeleted = true;
        project.DeletedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        Assert.Single(
            await context.AuditLogs
                .IgnoreQueryFilters()
                .Where(x => x.Entity == "Project" && x.Action == "Delete")
                .ToListAsync());

        Assert.Empty(
            await context.AuditLogs
                .IgnoreQueryFilters()
                .Where(x => x.Entity == "Project" && x.Action == "Update")
                .ToListAsync());
    }

    [Fact]
    public async Task Password_hashes_never_reach_the_audit_trail()
    {
        await using var connection = await OpenConnectionAsync();

        await using var context = await CreateContextAsync(
            connection,
            new TestTenant(null, true, null),
            new TestAuditContext());

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "audit-secret-user",
            PasswordHash = "SECRET-HASH-VALUE-1",
            FirstName = "Ann",
            IsActive = true
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        // A change to the hash alone is not an auditable data change.
        user.PasswordHash = "SECRET-HASH-VALUE-2";
        await context.SaveChangesAsync();

        user.FirstName = "Anna";
        await context.SaveChangesAsync();

        var rows = await context.AuditLogs
            .IgnoreQueryFilters()
            .Where(x => x.Entity == "User")
            .ToListAsync();

        Assert.Equal(2, rows.Count);
        Assert.Equal(new[] { "Create", "Update" }, rows.Select(x => x.Action).OrderBy(x => x));

        foreach (var row in rows)
        {
            Assert.DoesNotContain("SECRET-HASH", row.OldValues ?? string.Empty);
            Assert.DoesNotContain("SECRET-HASH", row.NewValues ?? string.Empty);
            Assert.DoesNotContain("PasswordHash", row.OldValues ?? string.Empty);
            Assert.DoesNotContain("PasswordHash", row.NewValues ?? string.Empty);
        }
    }

    [Fact]
    public async Task Large_batches_are_summarised_in_one_row()
    {
        await using var connection = await OpenConnectionAsync();
        Guid companyId = Guid.NewGuid();

        await using var context = await CreateContextAsync(
            connection,
            new TestTenant(companyId, false, Guid.NewGuid()),
            new TestAuditContext());

        await SeedCompanyAsync(context, companyId);

        for (int i = 0; i < 30; i++)
        {
            context.Plants.Add(new Plant
            {
                Id = Guid.NewGuid(),
                CompanyId = companyId,
                Code = $"PL-{i:00}",
                Name = $"Plant {i}"
            });
        }

        await context.SaveChangesAsync();

        var row = await context.AuditLogs
            .IgnoreQueryFilters()
            .SingleAsync(x => x.Entity == "Plant");

        Assert.Equal("Create", row.Action);
        Assert.Equal("bulk:30", row.EntityId);
    }

    [Fact]
    public async Task Login_and_password_events_are_recorded_without_secrets()
    {
        const string password = "Correct-Passw0rd!";
        const string wrongPassword = "Wrong-Passw0rd!";
        const string newPassword = "Brand-New-Passw0rd!";

        await using var connection = await OpenConnectionAsync();
        Guid companyId = Guid.NewGuid();
        var hasher = new PasswordHasher();

        await using var context = await CreateContextAsync(
            connection,
            null,
            new TestAuditContext());

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "audit-login-user",
            PasswordHash = hasher.Hash(password),
            IsActive = true
        };

        context.Companies.Add(new Company
        {
            Id = companyId,
            Code = "AUD-LOGIN",
            Name = "Audit Login Co",
            IsActive = true
        });
        context.Users.Add(user);
        context.CompanyUsers.Add(new CompanyUser
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            CompanyId = companyId,
            IsActive = true
        });
        await context.SaveChangesAsync();

        var auth = new AuthService(
            context,
            hasher,
            new TestJwtService(),
            new AuditService(context, new TestAuditContext()));

        Assert.Null(await auth.LoginAsync(new LoginRequest
        {
            Username = user.UserName,
            Password = wrongPassword
        }));

        Assert.NotNull(await auth.LoginAsync(new LoginRequest
        {
            Username = user.UserName,
            Password = password
        }));

        Assert.False(await auth.ChangePasswordAsync(user.Id, new ChangePasswordRequest
        {
            CurrentPassword = wrongPassword,
            NewPassword = newPassword
        }));

        Assert.True(await auth.ChangePasswordAsync(user.Id, new ChangePasswordRequest
        {
            CurrentPassword = password,
            NewPassword = newPassword
        }));

        var rows = await context.AuditLogs
            .IgnoreQueryFilters()
            .Where(x => x.Module == "Security" && x.Entity == "User" && x.EntityId == user.Id.ToString())
            .ToListAsync();

        var failed = rows.Single(x => x.Action == "LoginFailed");
        Assert.Equal("audit-login-user", failed.Username);
        Assert.Equal("invalid_credentials", failed.NewValues);

        var login = rows.Single(x => x.Action == "Login");
        Assert.Equal(user.Id, login.UserId);
        Assert.Equal(companyId, login.CompanyId);

        Assert.Single(rows, x => x.Action == "PasswordChangeFailed");
        Assert.Single(rows, x => x.Action == "PasswordChanged");

        var everything = await context.AuditLogs.IgnoreQueryFilters().ToListAsync();

        foreach (var row in everything)
        {
            foreach (string secret in new[] { password, wrongPassword, newPassword })
            {
                Assert.DoesNotContain(secret, row.NewValues ?? string.Empty);
                Assert.DoesNotContain(secret, row.OldValues ?? string.Empty);
                Assert.DoesNotContain(secret, row.Username);
            }
        }
    }

    private static async Task<SqliteConnection> OpenConnectionAsync()
    {
        var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        return connection;
    }

    private static async Task<PCSDbContext> CreateContextAsync(
        SqliteConnection connection,
        ICurrentTenant? tenant,
        IAuditContext? auditContext)
    {
        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new PCSDbContext(options, tenant, auditContext);
        await context.Database.EnsureCreatedAsync();
        return context;
    }

    private static async Task SeedCompanyAsync(PCSDbContext context, Guid companyId)
    {
        context.Companies.Add(new Company
        {
            Id = companyId,
            Code = $"AUD-{companyId:N}"[..12],
            Name = "Audit Company",
            IsActive = true
        });

        await context.SaveChangesAsync();
    }

    private static Project NewProject(Guid companyId, string code, string name) =>
        new()
        {
            Id = Guid.NewGuid(),
            CompanyId = companyId,
            Code = code,
            Name = name,
            StartDate = new DateOnly(2026, 1, 1),
            IsActive = true
        };

    private sealed record TestTenant(
        Guid? CompanyId,
        bool IsPlatformAdmin,
        Guid? UserId) : ICurrentTenant
    {
        public bool IsGlobalScope =>
            IsPlatformAdmin && !CompanyId.HasValue;
    }

    private sealed class TestAuditContext : IAuditContext
    {
        public string? Username => "alice";

        public string? IpAddress => "10.0.0.7";

        public string? UserAgent => "xunit";

        public string? CorrelationId => "corr-123";
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
