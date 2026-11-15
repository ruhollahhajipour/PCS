using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;

namespace PCS.Application.Tests.Api;

/// <summary>
/// Runs the real API (Program.cs, middleware, JWT, tenant filters, security
/// seed) against a throw-away SQLite file. Schema is created up front because
/// the API deliberately never migrates at startup.
/// </summary>
public sealed class PcsApiFactory : WebApplicationFactory<Program>
{
    public const string Password = "Correct-Passw0rd!";

    private static readonly string[] EnvironmentKeys =
    [
        "ConnectionStrings__DefaultConnection",
        "Database__Provider",
        "Jwt__Secret",
        "InitialAdmin__Username",
        "InitialAdmin__Password",
        "Security__Lockout__MaxFailedAttempts",
        "Security__Lockout__LockoutMinutes"
    ];

    private readonly string _databasePath;
    private bool _seeded;

    public PcsApiFactory()
    {
        _databasePath = Path.Combine(
            Path.GetTempPath(),
            $"pcs-api-tests-{Guid.NewGuid():N}.db");

        string connectionString = $"Data Source={_databasePath}";

        // Environment variables are the only configuration source that Program.cs
        // sees before the host is built.
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", connectionString);
        Environment.SetEnvironmentVariable("Database__Provider", "Sqlite");
        Environment.SetEnvironmentVariable("Jwt__Secret", new string('k', 64));
        Environment.SetEnvironmentVariable("InitialAdmin__Username", "root-admin");
        Environment.SetEnvironmentVariable("InitialAdmin__Password", "Initial-Adm1n-Passw0rd!");
        Environment.SetEnvironmentVariable("Security__Lockout__MaxFailedAttempts", "3");
        Environment.SetEnvironmentVariable("Security__Lockout__LockoutMinutes", "15");

        using var context = new PCSDbContext(
            new DbContextOptionsBuilder<PCSDbContext>()
                .UseSqlite(connectionString)
                .Options);

        context.Database.EnsureCreated();
    }

    public CapturingMailer Mail { get; } = new();

    public LoginCache LoginCache { get; } = new();

    public Guid CompanyA { get; } = Guid.NewGuid();

    public Guid CompanyB { get; } = Guid.NewGuid();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<IEmailSender>();
            services.AddSingleton<IEmailSender>(Mail);
        });
    }

    /// <summary>Creates the two companies and the users of the scenarios, once.</summary>
    public async Task SeedAsync()
    {
        if (_seeded)
        {
            return;
        }

        // Touching Services starts the host, which also runs the security seed.
        using IServiceScope scope = Services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<PCSDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        Role projectManager = await db.Roles.SingleAsync(x => x.Code == "PROJECT_MANAGER");
        Role viewer = await db.Roles.SingleAsync(x => x.Code == "VIEWER");

        db.Companies.Add(new Company { Id = CompanyA, Code = "CO-A", Name = "Company A", IsActive = true });
        db.Companies.Add(new Company { Id = CompanyB, Code = "CO-B", Name = "Company B", IsActive = true });

        AddMember(db, hasher, "alice", "alice@a.example", CompanyA, projectManager);
        AddMember(db, hasher, "carol", "carol@a.example", CompanyA, viewer);
        AddMember(db, hasher, "bob", "bob@b.example", CompanyB, projectManager);
        AddMember(db, hasher, "locky", "locky@a.example", CompanyA, projectManager);
        AddMember(db, hasher, "refresher", "refresher@a.example", CompanyA, projectManager);
        AddMember(db, hasher, "forgetful", "forgetful@a.example", CompanyA, projectManager);

        await db.SaveChangesAsync();

        _seeded = true;
    }

    private static void AddMember(
        PCSDbContext db,
        IPasswordHasher hasher,
        string userName,
        string email,
        Guid companyId,
        Role role)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = userName,
            Email = email,
            FirstName = userName,
            PasswordHash = hasher.Hash(Password),
            IsActive = true
        };

        db.Users.Add(user);

        db.CompanyUsers.Add(new CompanyUser
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            CompanyId = companyId,
            IsActive = true
        });

        db.UserRoles.Add(new UserRole
        {
            UserId = user.Id,
            RoleId = role.Id,
            CompanyId = companyId,
            IsActive = true,
            AssignedAt = DateTime.UtcNow
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (!disposing)
        {
            return;
        }

        foreach (string key in EnvironmentKeys)
        {
            Environment.SetEnvironmentVariable(key, null);
        }

        SqliteConnection.ClearAllPools();

        try
        {
            File.Delete(_databasePath);
        }
        catch (IOException)
        {
            // A leftover temp file is harmless.
        }
    }
}

public sealed class CapturingMailer : IEmailSender
{
    private readonly List<EmailMessage> _sent = new();

    public IReadOnlyList<EmailMessage> Sent
    {
        get
        {
            lock (_sent)
            {
                return _sent.ToList();
            }
        }
    }

    public Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default)
    {
        lock (_sent)
        {
            _sent.Add(message);
        }

        return Task.CompletedTask;
    }
}

public sealed class LoginCache
{
    private readonly Dictionary<string, PCS.Application.Identity.DTOs.LoginResponse> _logins = new();

    public async Task<PCS.Application.Identity.DTOs.LoginResponse> GetOrAddAsync(
        string userName,
        Func<Task<PCS.Application.Identity.DTOs.LoginResponse>> login)
    {
        if (_logins.TryGetValue(userName, out var cached))
        {
            return cached;
        }

        var response = await login();
        _logins[userName] = response;

        return response;
    }
}

[CollectionDefinition(Name)]
public sealed class ApiCollection : ICollectionFixture<PcsApiFactory>
{
    public const string Name = "PCS API";
}
