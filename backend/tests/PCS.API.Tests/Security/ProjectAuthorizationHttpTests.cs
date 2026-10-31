using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using PCS.API.Controllers;
using PCS.API.Security;
using PCS.Application.Common.Security;
using PCS.Application.Projects.DTOs;
using PCS.Application.Projects.Interfaces;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Security;
using PCS.Infrastructure.Persistence;
using Xunit;

namespace PCS.API.Tests.Security;

public sealed class ProjectAuthorizationHttpTests
{
    [Fact]
    public async Task AuthenticatedMember_CanReadOwnProject_ButNotForeignProject()
    {
        await using var fixture = await Fixture.CreateAsync();
        using var client = fixture.Server.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            fixture.Bearer(fixture.MemberUser.Id, Permissions.ProjectView);

        var ownResponse = await client.GetAsync($"/api/projects/{fixture.ProjectA.Id}");
        var foreignResponse = await client.GetAsync($"/api/projects/{fixture.ProjectB.Id}");

        Assert.Equal(System.Net.HttpStatusCode.OK, ownResponse.StatusCode);
        Assert.Equal(System.Net.HttpStatusCode.NotFound, foreignResponse.StatusCode);
    }

    [Fact]
    public async Task ProjectsEndpoint_RequiresAuthentication()
    {
        await using var fixture = await Fixture.CreateAsync();
        using var client = fixture.Server.CreateClient();

        var response = await client.GetAsync($"/api/projects/{fixture.ProjectA.Id}");

        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ProjectsEndpoint_RequiresProjectViewPermission()
    {
        await using var fixture = await Fixture.CreateAsync();
        using var client = fixture.Server.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            fixture.Bearer(fixture.MemberUser.Id, "UNRELATED_PERMISSION");

        var response = await client.GetAsync($"/api/projects/{fixture.ProjectA.Id}");

        Assert.Equal(System.Net.HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ExistingJwt_LosesResourceAccessWhenMembershipIsDeactivated()
    {
        await using var fixture = await Fixture.CreateAsync();
        using var client = fixture.Server.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            fixture.Bearer(fixture.MemberUser.Id, Permissions.ProjectView);

        await using (var scope = fixture.Host.Services.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PCSDbContext>();
            var membership = await db.CompanyUsers.SingleAsync(x =>
                x.CompanyId == fixture.CompanyA.Id &&
                x.UserId == fixture.MemberUser.Id);
            membership.IsActive = false;
            await db.SaveChangesAsync();
        }

        var response = await client.GetAsync($"/api/projects/{fixture.ProjectA.Id}");

        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ExistingJwt_CannotReadProjectAfterUserIsDeactivated()
    {
        await using var fixture = await Fixture.CreateAsync();
        using var client = fixture.Server.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            fixture.Bearer(fixture.MemberUser.Id, Permissions.ProjectView);

        await using (var scope = fixture.Host.Services.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PCSDbContext>();
            var user = await db.Users.SingleAsync(x => x.Id == fixture.MemberUser.Id);
            user.IsActive = false;
            await db.SaveChangesAsync();
        }

        var response = await client.GetAsync($"/api/projects/{fixture.ProjectA.Id}");

        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private const string Issuer = "PCS.IntegrationTests";
        private const string Audience = "PCS.IntegrationTests";
        private const string SigningSecret =
            "PCS-Test-Only-Signing-Key-Not-For-Production-2026";
        private readonly SqliteConnection _connection;

        public IHost Host { get; }
        public TestServer Server => Host.GetTestServer();
        public User MemberUser { get; } = new()
        {
            UserName = "http.tenant.member",
            IsActive = true
        };
        public Company CompanyA { get; } = new()
        {
            Code = "HTTP-TENANT-A",
            Name = "HTTP Tenant A",
            IsActive = true
        };
        public Company CompanyB { get; } = new()
        {
            Code = "HTTP-TENANT-B",
            Name = "HTTP Tenant B",
            IsActive = true
        };
        public Project ProjectA { get; private set; } = null!;
        public Project ProjectB { get; private set; } = null!;

        private Fixture(SqliteConnection connection, IHost host)
        {
            _connection = connection;
            Host = host;
        }

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();

            var host = await new HostBuilder()
                .ConfigureWebHost(web =>
                {
                    web.UseTestServer();
                    web.ConfigureServices(services =>
                    {
                        services.AddRouting();
                        services.AddControllers()
                            .AddApplicationPart(typeof(ProjectsController).Assembly);
                        services.AddDbContext<PCSDbContext>(options =>
                            options.UseSqlite(connection));
                        services.AddScoped<IProjectAccessGuard, ProjectAccessGuard>();
                        services.AddSingleton<FakeProjectService>();
                        services.AddScoped<IProjectService>(sp =>
                            sp.GetRequiredService<FakeProjectService>());

                        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuerSigningKey = true,
                                    IssuerSigningKey = new SymmetricSecurityKey(
                                        Encoding.UTF8.GetBytes(SigningSecret)),
                                    ValidateIssuer = true,
                                    ValidIssuer = Issuer,
                                    ValidateAudience = true,
                                    ValidAudience = Audience,
                                    ValidateLifetime = true,
                                    ClockSkew = TimeSpan.Zero
                                };
                            });

                        services.AddAuthorization(options =>
                        {
                            foreach (var permission in PermissionProvider.GetAll())
                            {
                                options.AddPolicy(permission, policy =>
                                {
                                    policy.RequireAuthenticatedUser();
                                    policy.RequireClaim("permission", permission);
                                });
                            }
                        });
                    });
                    web.Configure(app =>
                    {
                        app.UseRouting();
                        app.UseAuthentication();
                        app.UseAuthorization();
                        app.UseEndpoints(endpoints => endpoints.MapControllers());
                    });
                })
                .StartAsync();

            var fixture = new Fixture(connection, host);
            await fixture.SeedAsync();
            return fixture;
        }

        private async Task SeedAsync()
        {
            await using var scope = Host.Services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<PCSDbContext>();
            await db.Database.EnsureCreatedAsync();

            ProjectA = new Project
            {
                Code = "HTTP-PROJECT-A",
                Name = "HTTP Project A",
                CompanyId = CompanyA.Id,
                Company = CompanyA
            };
            ProjectB = new Project
            {
                Code = "HTTP-PROJECT-B",
                Name = "HTTP Project B",
                CompanyId = CompanyB.Id,
                Company = CompanyB
            };

            var membership = new CompanyUser
            {
                CompanyId = CompanyA.Id,
                UserId = MemberUser.Id,
                Company = CompanyA,
                User = MemberUser,
                IsActive = true
            };
            CompanyA.Users.Add(membership);
            MemberUser.Companies.Add(membership);

            db.AddRange(CompanyA, CompanyB, MemberUser, ProjectA, ProjectB);
            await db.SaveChangesAsync();

            var projectService = scope.ServiceProvider.GetRequiredService<FakeProjectService>();
            projectService.Add(ProjectA);
            projectService.Add(ProjectB);
        }

        public System.Net.Http.Headers.AuthenticationHeaderValue Bearer(
            Guid userId,
            string permission)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim("permission", permission)
            };
            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningSecret)),
                SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                Issuer,
                Audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(5),
                signingCredentials: credentials);

            return new System.Net.Http.Headers.AuthenticationHeaderValue(
                "Bearer",
                new JwtSecurityTokenHandler().WriteToken(token));
        }

        public async ValueTask DisposeAsync()
        {
            await Host.StopAsync();
            Host.Dispose();
            await _connection.DisposeAsync();
        }
    }

    private sealed class FakeProjectService : IProjectService
    {
        private readonly Dictionary<Guid, ProjectDto> _projects = new();

        public FakeProjectService()
        {
        }

        public void Add(Project project) =>
            _projects[project.Id] = new ProjectDto
            {
                Id = project.Id,
                Code = project.Code,
                Name = project.Name,
                CompanyId = project.CompanyId,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Currency = "USD",
                Status = "Planning",
                IsActive = true
            };

        public Task<IEnumerable<ProjectDto>> GetAllAsync() =>
            Task.FromResult<IEnumerable<ProjectDto>>(_projects.Values);

        public Task<IEnumerable<ProjectDto>> GetByCompanyIdsAsync(
            IReadOnlyCollection<Guid> companyIds) =>
            Task.FromResult<IEnumerable<ProjectDto>>(
                _projects.Values.Where(x => companyIds.Contains(x.CompanyId)).ToArray());

        public Task<ProjectDto?> GetByIdAsync(Guid id) =>
            Task.FromResult(_projects.GetValueOrDefault(id));

        public Task<Guid> CreateAsync(CreateProjectDto request) =>
            Task.FromResult(Guid.NewGuid());

        public Task UpdateAsync(Guid id, CreateProjectDto request) =>
            Task.CompletedTask;

        public Task DeleteAsync(Guid id) =>
            Task.CompletedTask;
    }
}
