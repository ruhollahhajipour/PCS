using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Services;
using PCS.Infrastructure.Services.Identity;

namespace PCS.Application.Tests.Security;

public sealed class RefreshTokenServiceTests
{
    [Fact]
    public async Task Tokens_are_stored_hashed_and_rotate_in_a_chain()
    {
        await using var fx = await Fixture.CreateAsync();

        var first = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);

        var stored = await fx.Context.RefreshTokens.AsNoTracking().SingleAsync();
        Assert.NotEqual(first.Token, stored.TokenHash);
        Assert.DoesNotContain(first.Token, stored.TokenHash);
        Assert.Equal("10.0.0.9", stored.CreatedByIp);

        string current = first.Token;
        Guid family = stored.FamilyId;

        for (int i = 0; i < 3; i++)
        {
            var next = await fx.Service.RotateAsync(current, null);

            Assert.NotNull(next);
            Assert.NotEqual(current, next!.Token);
            Assert.Equal(fx.UserId, next.UserId);
            Assert.Equal(fx.CompanyId, next.CompanyId);
            Assert.Equal(family, next.FamilyId);

            current = next.Token;
            fx.Clock.Advance(TimeSpan.FromMinutes(1));
        }

        Assert.Equal(4, await fx.Context.RefreshTokens.CountAsync());
        Assert.Equal(1, await fx.Context.RefreshTokens.CountAsync(x => x.RevokedAt == null));
    }

    [Fact]
    public async Task Rotation_can_switch_company()
    {
        await using var fx = await Fixture.CreateAsync();
        Guid other = Guid.NewGuid();

        var first = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);
        var next = await fx.Service.RotateAsync(first.Token, other);

        Assert.Equal(other, next!.CompanyId);

        var again = await fx.Service.RotateAsync(next.Token, null);
        Assert.Equal(other, again!.CompanyId);
    }

    [Fact]
    public async Task Replaying_a_used_token_after_the_grace_period_revokes_the_whole_session()
    {
        await using var fx = await Fixture.CreateAsync();

        var first = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);
        var second = await fx.Service.RotateAsync(first.Token, null);

        fx.Clock.Advance(TimeSpan.FromSeconds(60));

        Assert.Null(await fx.Service.RotateAsync(first.Token, null));

        // The thief's replay also killed the legitimate newest token.
        Assert.Null(await fx.Service.RotateAsync(second!.Token, null));
        Assert.Equal(0, await fx.Context.RefreshTokens.CountAsync(x => x.RevokedAt == null));

        var audit = await fx.Context.AuditLogs.IgnoreQueryFilters()
            .SingleAsync(x => x.Action == "RefreshTokenReuse");
        Assert.Equal(fx.UserId, audit.UserId);
        Assert.DoesNotContain(first.Token, audit.NewValues ?? string.Empty);
    }

    [Fact]
    public async Task A_second_tab_refreshing_inside_the_grace_period_does_not_kill_the_session()
    {
        await using var fx = await Fixture.CreateAsync();

        var first = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);
        var second = await fx.Service.RotateAsync(first.Token, null);

        fx.Clock.Advance(TimeSpan.FromSeconds(3));

        Assert.Null(await fx.Service.RotateAsync(first.Token, null));
        Assert.NotNull(await fx.Service.RotateAsync(second!.Token, null));
        Assert.Empty(await fx.Context.AuditLogs.IgnoreQueryFilters()
            .Where(x => x.Action == "RefreshTokenReuse").ToListAsync());
    }

    [Fact]
    public async Task Expired_unknown_and_malformed_tokens_are_rejected()
    {
        await using var fx = await Fixture.CreateAsync();

        var first = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);

        Assert.Null(await fx.Service.RotateAsync("not-a-token", null));
        Assert.Null(await fx.Service.RotateAsync("", null));
        Assert.Null(await fx.Service.RotateAsync(new string('x', 1000), null));

        fx.Clock.Advance(TimeSpan.FromDays(15));
        Assert.Null(await fx.Service.RotateAsync(first.Token, null));
    }

    [Fact]
    public async Task Logout_revokes_the_session_and_is_audited()
    {
        await using var fx = await Fixture.CreateAsync();

        var first = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);
        var second = await fx.Service.RotateAsync(first.Token, null);

        await fx.Service.RevokeByTokenAsync(second!.Token);
        await fx.Service.RevokeByTokenAsync("unknown-token");

        fx.Clock.Advance(TimeSpan.FromSeconds(60));
        Assert.Null(await fx.Service.RotateAsync(second.Token, null));

        Assert.Single(await fx.Context.AuditLogs.IgnoreQueryFilters()
            .Where(x => x.Action == "Logout").ToListAsync());
    }

    [Fact]
    public async Task Sessions_are_listed_and_only_the_owner_can_revoke_them()
    {
        await using var fx = await Fixture.CreateAsync();

        var a = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);
        fx.Clock.Advance(TimeSpan.FromMinutes(5));
        await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);
        await fx.Service.RotateAsync(a.Token, null);

        var sessions = await fx.Service.ListSessionsAsync(fx.UserId);

        // One entry per session (family), not per token.
        Assert.Equal(2, sessions.Count);
        Assert.All(sessions, s => Assert.Equal("10.0.0.9", s.IpAddress));
        Assert.Empty(await fx.Service.ListSessionsAsync(Guid.NewGuid()));

        Guid target = sessions[0].Id;

        Assert.False(await fx.Service.RevokeSessionAsync(Guid.NewGuid(), target));
        Assert.True(await fx.Service.RevokeSessionAsync(fx.UserId, target));
        Assert.False(await fx.Service.RevokeSessionAsync(fx.UserId, target));
        Assert.Single(await fx.Service.ListSessionsAsync(fx.UserId));
    }

    [Fact]
    public async Task Revoking_all_sessions_ends_every_token_of_the_user()
    {
        await using var fx = await Fixture.CreateAsync();

        var a = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);
        var b = await fx.Service.IssueAsync(fx.UserId, fx.CompanyId);

        await fx.Service.RevokeAllForUserAsync(fx.UserId, "password_changed");

        fx.Clock.Advance(TimeSpan.FromSeconds(60));
        Assert.Null(await fx.Service.RotateAsync(a.Token, null));
        Assert.Null(await fx.Service.RotateAsync(b.Token, null));
        Assert.Empty(await fx.Service.ListSessionsAsync(fx.UserId));
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private Fixture(
            SqliteConnection connection,
            PCSDbContext context,
            RefreshTokenService service,
            MutableClock clock,
            Guid userId)
        {
            _connection = connection;
            Context = context;
            Service = service;
            Clock = clock;
            UserId = userId;
        }

        public PCSDbContext Context { get; }
        public RefreshTokenService Service { get; }
        public MutableClock Clock { get; }
        public Guid UserId { get; }
        public Guid CompanyId { get; } = Guid.NewGuid();

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();

            var context = new PCSDbContext(
                new DbContextOptionsBuilder<PCSDbContext>().UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();

            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = "refresh-user",
                PasswordHash = "x",
                IsActive = true
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var clock = new MutableClock(new DateTimeOffset(2026, 11, 9, 8, 0, 0, TimeSpan.Zero));
            var auditContext = new TestAuditContext();

            var service = new RefreshTokenService(
                context,
                auditContext,
                new AuditService(context, auditContext),
                new RefreshTokenOptions { LifetimeDays = 14, ReuseGraceSeconds = 10 },
                clock);

            return new Fixture(connection, context, service, clock, user.Id);
        }

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

    private sealed class TestAuditContext : IAuditContext
    {
        public string? Username => "refresh-user";
        public string? IpAddress => "10.0.0.9";
        public string? UserAgent => "xunit";
        public string? CorrelationId => "corr-refresh";
    }
}
