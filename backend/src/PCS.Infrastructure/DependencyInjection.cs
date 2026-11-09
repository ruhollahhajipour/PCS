using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;
using PCS.Application.Identity.Interfaces;
using PCS.Application.Projects.Interfaces;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Licensing.Interfaces;

using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Repositories;
using PCS.Infrastructure.Services;
using PCS.Infrastructure.Services.Identity;

namespace PCS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ==========================
        // Database
        // ==========================

        string? connectionString =
            configuration.GetConnectionString(
                "DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "PCS database connection string was not configured.");
        }

        string provider =
            DatabaseProviderResolver.GetProvider(configuration);

        services.AddDbContext<PCSDbContext>(
            options =>
                DatabaseProviderResolver.Configure(
                    options,
                    provider,
                    connectionString));


        // ==========================
        // Repositories
        // ==========================

        services.AddScoped(
            typeof(IGenericRepository<>),
            typeof(GenericRepository<>));


        services.AddScoped<
            IProjectRepository,
            ProjectRepository>();


        services.AddScoped<
            IActivityRepository,
            ActivityRepository>();


        services.AddScoped<
            IActivityRelationshipRepository,
            ActivityRelationshipRepository>();


        // ==========================
        // Persistence
        // ==========================

        services.AddScoped<
            IUnitOfWork,
            UnitOfWork>();


        // ==========================
        // Identity / Security
        // ==========================

        services.AddScoped<
         IPasswordHasher,
         PasswordHasher>();


        services.AddScoped<
         IJwtService,
         JwtService>();


        services.AddSingleton(
            configuration
                .GetSection(LockoutOptions.SectionName)
                .Get<LockoutOptions>() ?? new LockoutOptions());


        services.AddSingleton(
            configuration
                .GetSection(RefreshTokenOptions.SectionName)
                .Get<RefreshTokenOptions>() ?? new RefreshTokenOptions());


        services.AddScoped<
         IRefreshTokenService,
         RefreshTokenService>();


        services.AddScoped<
         IAuthService,
         AuthService>();


        // ==========================
        // Services
        // ==========================

        services.AddScoped<
            IAuditService,
            AuditService>();


        // ==========================
        // Licensing
        // ==========================

        services.AddScoped<
            ILicenseService,
            LicenseService>();


        return services;
    }

}