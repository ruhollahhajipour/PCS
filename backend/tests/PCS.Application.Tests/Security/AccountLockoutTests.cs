using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;
using PCS.Application.Identity.DTOs;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Services;
using PCS.Infrastructure.Services.Identity;

namespace PCS.Application.Tests.Security;

public sealed class AccountLockoutTests
{
    private const string Password = "Correct-Passw0rd!";
    private const string Wrong = "Wrong-Passw0rd!";

    [Fact]
    public async Task Account_locks_after_the_configured_failures_and_ignores_the_right_password()
    {
        await using var fx = await Fixture.CreateAsync(new LockoutOptions { MaxFailedAttempts = 3, LockoutMinutes = 10 });

        for (int i = 0; i < 3; i++)
        {
            Assert.Null(await fx.LoginAsync(Wrong));
        }

        // Locked: even the correct password is refused.
        Assert.Null(await fx.LoginAsync(Password));

        var user = await fx.LoadUserAsync();
        Assert.NotNull(user.LockoutEnd);

        // Still locked just before the window ends.
        fx.Clock.Advance(TimeSpan.FromMinutes(9));
        Assert.Null(await fx.LoginAsync(Password));

        // Free after the window; success clears the state.
        fx.Clock.Advance(TimeSpan.FromMinutes(2));
        Assert.NotNull(await fx.LoginAsync(Password));

        user = await fx.LoadUserAsync();
        Assert.Null(user.LockoutEnd);
        Assert.Equal(0, user.FailedLoginCount);
    }

    [Fact]
    public async Task A_successful_login_resets_the_failure_counter()
    {
        await using var fx = await Fixture.CreateAsync(new LockoutOptions { MaxFailedAttempts = 3, LockoutMinutes = 10 });

        Assert.Null(await fx.LoginAsync(Wrong));
        Assert.Null(await fx.LoginAsync(Wrong));
        Assert.NotNull(await fx.LoginAsync(Password));
        Assert.Null(await fx.LoginAsync(Wrong));
        Assert.Null(await fx.LoginAsync(Wrong));

        // Two failures after the reset: not locked yet.
        Assert.NotNull(await fx.LoginAsync(Password));
    }

    [Fact]
    public async Task Lockout_can_be_disabled()
    {
        await using var fx = await Fixture.CreateAsync(new LockoutOptions { MaxFailedAttempts = 0 });

        for (int i = 0; i < 20; i++)
        {
            Assert.Null(await fx.LoginAsync(Wrong));
        }

        Assert.NotNull(await fx.LoginAsync(Password));
    }

    [Fact]
    public async Task Lockout_is_audited_without_secrets_and_unknown_users_are_not_tracked()
    {
        await using var fx = await Fixture.CreateAsync(new LockoutOptions { MaxFailedAttempts = 2, LockoutMinutes = 5 });

        Assert.Null(await fx.LoginAsync(Wrong));
        Assert.Null(await fx.LoginAsync(Wrong));
        Assert.Null(await fx.LoginAsync(Password));

        Assert.Null(await fx.Auth.LoginAsync(new LoginRequest { Username = "no-such-user", Password = Wrong }));

        var rows = await fx.Context.AuditLogs.IgnoreQueryFilters().ToListAsync();

        Assert.Single(rows, x => x.Action == "AccountLocked");
        Assert.Single(rows, x => x.Action == "LoginFailed" && x.NewValues == "locked_out");
        Assert.Equal(3, rows.Count(x => x.Action == "LoginFailed" && x.NewValues == "invalid_credentials"));

        // Failure counters are bookkeeping, not an audited data change.
        Assert.DoesNotContain(rows, x => x.Entity == "User" && x.Action == "Update");

        foreach (var row in rows)
        {
            Assert.DoesNotContain(Password, row.NewValues ?? string.Empty);
            Assert.DoesNotContain(Wrong, row.NewValues ?? string.Empty);
        }
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private Fixture(SqliteConnection connection, PCSDbContext context, AuthService auth, MutableClock clock, string username)
        {
            _connection = connection;
            Context = context;
            Auth = auth;
            Clock = clock;
            Username = username;
        }

        public PCSDbContext Context { get; }
        public AuthService Auth { get; }
        public MutableClock Clock { get; }
        public string Username { get; }

        public static async Task<Fixture> CreateAsync(LockoutOptions options)
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();

            var context = new PCSDbContext(
                new DbContextOptionsBuilder<PCSDbContext>().UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();

            var hasher = new PasswordHasher();
            Guid companyId = Guid.NewGuid();
            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = "lockout-user",
                PasswordHash = hasher.Hash(Password),
                IsActive = true
            };

            context.Companies.Add(new Company { Id = companyId, Code = "LOCK-CO", Name = "Lockout Co", IsActive = true });
            context.Users.Add(user);
            context.CompanyUsers.Add(new CompanyUser
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                CompanyId = companyId,
                IsActive = true
            });
            await context.SaveChangesAsync();

            var clock = new MutableClock(new DateTimeOffset(2026, 11, 9, 8, 0, 0, TimeSpan.Zero));
            var auth = new AuthService(
                context,
                hasher,
                new StubJwtService(),
                new AuditService(context),
                options,
                clock);

            return new Fixture(connection, context, auth, clock, user.UserName);
        }

        public Task<LoginResponse?> LoginAsync(string password) =>
            Auth.LoginAsync(new LoginRequest { Username = Username, Password = password });

        public Task<User> LoadUserAsync() =>
            Context.Users.IgnoreQueryFilters().AsNoTracking().SingleAsync(x => x.UserName == Username);

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class MutableClock : TimeProvider
    {
        private DateTimeOffset _now;

        public MutableClock(DateTimeOffset start) => _now = start;

        public void Advance(TimeSpan by) => _now += by;

        public override DateTimeOffset GetUtcNow() => _now;
    }

    private sealed class StubJwtService : IJwtService
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
