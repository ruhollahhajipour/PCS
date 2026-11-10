using System.Text.RegularExpressions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;
using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Services;
using PCS.Infrastructure.Services.Identity;

namespace PCS.Application.Tests.Security;

public sealed class AccountRecoveryTests
{
    private const string OldPassword = "Old-Passw0rd!";
    private const string NewPassword = "New-Passw0rd-2026";

    [Fact]
    public async Task Reset_flow_changes_the_password_once_and_ends_all_sessions()
    {
        await using var fx = await Fixture.CreateAsync();

        var session = await fx.Refresh.IssueAsync(fx.User.Id, fx.CompanyId);
        fx.User.FailedLoginCount = 3;
        fx.User.LockoutEnd = fx.Clock.GetUtcNow().UtcDateTime.AddMinutes(10);
        await fx.Context.SaveChangesAsync();

        await fx.Recovery.RequestPasswordResetAsync("Recover.Me@Example.com");

        var mail = Assert.Single(fx.Mail.Sent);
        Assert.Equal("recover.me@example.com", mail.To);
        string code = fx.Mail.LastCode();

        // Typed with a space and in lower case is still accepted.
        Assert.True(await fx.Recovery.ResetPasswordAsync(
            "recover-user", code.Replace("-", " - ").ToLowerInvariant(), NewPassword));

        var user = await fx.ReloadUserAsync();
        Assert.True(fx.Hasher.Verify(NewPassword, user.PasswordHash));
        Assert.False(fx.Hasher.Verify(OldPassword, user.PasswordHash));
        Assert.Equal(0, user.FailedLoginCount);
        Assert.Null(user.LockoutEnd);
        Assert.NotNull(user.EmailVerifiedAt);

        // The code works once.
        Assert.False(await fx.Recovery.ResetPasswordAsync("recover-user", code, "Another-Passw0rd!"));

        // The old session cannot be refreshed any more.
        fx.Clock.Advance(TimeSpan.FromMinutes(1));
        Assert.Null(await fx.Refresh.RotateAsync(session.Token, null));
    }

    [Fact]
    public async Task Unknown_accounts_and_accounts_without_an_address_send_nothing_and_do_not_fail()
    {
        await using var fx = await Fixture.CreateAsync();

        await fx.Recovery.RequestPasswordResetAsync("nobody@example.com");
        await fx.Recovery.RequestPasswordResetAsync("no-such-user");
        await fx.Recovery.RequestPasswordResetAsync("");
        await fx.Recovery.RequestPasswordResetAsync("no-email-user");

        Assert.Empty(fx.Mail.Sent);
        Assert.False(await fx.Recovery.ResetPasswordAsync("no-such-user", "ABCD-EFGH", NewPassword));
    }

    [Fact]
    public async Task A_code_dies_after_too_many_wrong_guesses_even_for_the_right_code()
    {
        await using var fx = await Fixture.CreateAsync();

        await fx.Recovery.RequestPasswordResetAsync("recover-user");
        string code = fx.Mail.LastCode();

        for (int i = 0; i < 5; i++)
        {
            Assert.False(await fx.Recovery.ResetPasswordAsync("recover-user", "WRONGCDE", NewPassword));
        }

        Assert.False(await fx.Recovery.ResetPasswordAsync("recover-user", code, NewPassword));

        var user = await fx.ReloadUserAsync();
        Assert.True(fx.Hasher.Verify(OldPassword, user.PasswordHash));
    }

    [Fact]
    public async Task Codes_expire()
    {
        await using var fx = await Fixture.CreateAsync();

        await fx.Recovery.RequestPasswordResetAsync("recover-user");
        string code = fx.Mail.LastCode();

        fx.Clock.Advance(TimeSpan.FromMinutes(16));

        Assert.False(await fx.Recovery.ResetPasswordAsync("recover-user", code, NewPassword));
    }

    [Fact]
    public async Task Requests_are_rate_limited_per_account_and_a_new_code_replaces_the_old_one()
    {
        await using var fx = await Fixture.CreateAsync();

        await fx.Recovery.RequestPasswordResetAsync("recover-user");
        await fx.Recovery.RequestPasswordResetAsync("recover-user");
        Assert.Single(fx.Mail.Sent);
        string first = fx.Mail.LastCode();

        fx.Clock.Advance(TimeSpan.FromSeconds(61));
        await fx.Recovery.RequestPasswordResetAsync("recover-user");
        Assert.Equal(2, fx.Mail.Sent.Count);
        string second = fx.Mail.LastCode();

        Assert.NotEqual(first, second);
        Assert.False(await fx.Recovery.ResetPasswordAsync("recover-user", first, NewPassword));
        Assert.True(await fx.Recovery.ResetPasswordAsync("recover-user", second, NewPassword));
    }

    [Fact]
    public async Task A_too_short_password_is_refused_without_burning_the_code()
    {
        await using var fx = await Fixture.CreateAsync();

        await fx.Recovery.RequestPasswordResetAsync("recover-user");
        string code = fx.Mail.LastCode();

        Assert.False(await fx.Recovery.ResetPasswordAsync("recover-user", code, "short"));
        Assert.True(await fx.Recovery.ResetPasswordAsync("recover-user", code, NewPassword));
    }

    [Fact]
    public async Task Codes_are_never_stored_or_audited_in_clear()
    {
        await using var fx = await Fixture.CreateAsync();

        await fx.Recovery.RequestPasswordResetAsync("recover-user");
        string code = fx.Mail.LastCode();
        string bare = code.Replace("-", "");

        await fx.Recovery.ResetPasswordAsync("recover-user", "WRONGCDE", NewPassword);
        await fx.Recovery.ResetPasswordAsync("recover-user", code, NewPassword);

        foreach (var token in await fx.Context.PasswordResetTokens.AsNoTracking().ToListAsync())
        {
            Assert.DoesNotContain(bare, token.TokenHash);
            Assert.Equal(64, token.TokenHash.Length);
        }

        var rows = await fx.Context.AuditLogs.IgnoreQueryFilters().ToListAsync();

        Assert.Contains(rows, x => x.Action == "PasswordResetRequested");
        Assert.Contains(rows, x => x.Action == "PasswordResetFailed");
        Assert.Contains(rows, x => x.Action == "PasswordReset");

        foreach (var row in rows)
        {
            foreach (string secret in new[] { bare, code, NewPassword, "WRONGCDE" })
            {
                Assert.DoesNotContain(secret, row.NewValues ?? string.Empty);
                Assert.DoesNotContain(secret, row.OldValues ?? string.Empty);
            }
        }
    }

    [Fact]
    public async Task A_failing_mail_server_does_not_break_the_request()
    {
        await using var fx = await Fixture.CreateAsync();
        fx.Mail.Fail = true;

        await fx.Recovery.RequestPasswordResetAsync("recover-user");

        Assert.Empty(fx.Mail.Sent);
    }

    [Fact]
    public async Task Email_verification_flow()
    {
        await using var fx = await Fixture.CreateAsync();

        // No address: nothing to verify.
        Assert.False(await fx.Recovery.SendEmailVerificationAsync(fx.NoEmailUser.Id));

        Assert.True(await fx.Recovery.SendEmailVerificationAsync(fx.User.Id));
        string code = fx.Mail.LastCode();

        Assert.False(await fx.Recovery.VerifyEmailAsync(fx.User.Id, "WRONGCDE"));
        Assert.False(await fx.Recovery.VerifyEmailAsync(Guid.NewGuid(), code));
        Assert.True(await fx.Recovery.VerifyEmailAsync(fx.User.Id, code));

        Assert.NotNull((await fx.ReloadUserAsync()).EmailVerifiedAt);

        // Already verified: nothing more to send or verify.
        fx.Clock.Advance(TimeSpan.FromMinutes(5));
        Assert.False(await fx.Recovery.SendEmailVerificationAsync(fx.User.Id));
        Assert.False(await fx.Recovery.VerifyEmailAsync(fx.User.Id, code));
    }

    [Fact]
    public async Task A_verification_code_cannot_reset_a_password()
    {
        await using var fx = await Fixture.CreateAsync();

        Assert.True(await fx.Recovery.SendEmailVerificationAsync(fx.User.Id));
        string code = fx.Mail.LastCode();

        Assert.False(await fx.Recovery.ResetPasswordAsync("recover-user", code, NewPassword));
    }

    [Fact]
    public async Task Login_accepts_an_email_address_but_not_an_ambiguous_one()
    {
        await using var fx = await Fixture.CreateAsync();

        var auth = fx.CreateAuth();

        Assert.NotNull(await auth.LoginAsync(new LoginRequest { Username = "recover-user", Password = OldPassword }));
        Assert.NotNull(await auth.LoginAsync(new LoginRequest { Username = "  Recover.Me@EXAMPLE.com ", Password = OldPassword }));
        Assert.Null(await auth.LoginAsync(new LoginRequest { Username = "recover.me@example.com", Password = "wrong-password" }));

        // A second account with the same address makes the address ambiguous.
        fx.Context.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            UserName = "twin-user",
            PasswordHash = fx.Hasher.Hash(OldPassword),
            Email = "recover.me@example.com",
            IsActive = true
        });
        await fx.Context.SaveChangesAsync();

        Assert.Null(await auth.LoginAsync(new LoginRequest { Username = "recover.me@example.com", Password = OldPassword }));
        Assert.NotNull(await auth.LoginAsync(new LoginRequest { Username = "recover-user", Password = OldPassword }));
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private Fixture(SqliteConnection connection, PCSDbContext context)
        {
            _connection = connection;
            Context = context;
        }

        public PCSDbContext Context { get; }
        public PasswordHasher Hasher { get; } = new();
        public CapturingMailer Mail { get; } = new();
        public MutableClock Clock { get; } = new(new DateTimeOffset(2026, 11, 9, 8, 0, 0, TimeSpan.Zero));
        public Guid CompanyId { get; } = Guid.NewGuid();
        public User User { get; private set; } = null!;
        public User NoEmailUser { get; private set; } = null!;
        public RefreshTokenService Refresh { get; private set; } = null!;
        public AccountRecoveryService Recovery { get; private set; } = null!;

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();

            var context = new PCSDbContext(
                new DbContextOptionsBuilder<PCSDbContext>().UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();

            var fx = new Fixture(connection, context);

            fx.User = new User
            {
                Id = Guid.NewGuid(),
                UserName = "recover-user",
                PasswordHash = fx.Hasher.Hash(OldPassword),
                Email = "recover.me@example.com",
                IsActive = true
            };
            fx.NoEmailUser = new User
            {
                Id = Guid.NewGuid(),
                UserName = "no-email-user",
                PasswordHash = fx.Hasher.Hash(OldPassword),
                IsActive = true
            };

            context.Companies.Add(new Company { Id = fx.CompanyId, Code = "REC-CO", Name = "Recovery Co", IsActive = true });
            context.Users.AddRange(fx.User, fx.NoEmailUser);
            context.CompanyUsers.Add(new CompanyUser
            {
                Id = Guid.NewGuid(),
                UserId = fx.User.Id,
                CompanyId = fx.CompanyId,
                IsActive = true
            });
            await context.SaveChangesAsync();

            var audit = new AuditService(context);

            fx.Refresh = new RefreshTokenService(
                context, null, audit, new RefreshTokenOptions(), fx.Clock);

            fx.Recovery = new AccountRecoveryService(
                context,
                fx.Hasher,
                fx.Mail,
                fx.Refresh,
                new AccountRecoveryOptions { CodeKey = "test-key-test-key-test-key-test-key" },
                audit,
                fx.Clock);

            return fx;
        }

        public AuthService CreateAuth() =>
            new(Context, Hasher, new StubJwtService(), new AuditService(Context), null, Clock);

        public Task<User> ReloadUserAsync() =>
            Context.Users.IgnoreQueryFilters().AsNoTracking().SingleAsync(x => x.Id == User.Id);

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class CapturingMailer : IEmailSender
    {
        public List<EmailMessage> Sent { get; } = new();

        public bool Fail { get; set; }

        public Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default)
        {
            if (Fail)
            {
                throw new InvalidOperationException("SMTP down");
            }

            Sent.Add(message);
            return Task.CompletedTask;
        }

        public string LastCode() =>
            Regex.Match(Sent[^1].Body, "[A-Z2-9]{4}-[A-Z2-9]{4}").Value;
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
