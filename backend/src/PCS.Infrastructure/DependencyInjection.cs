using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


using PCS.Application.Common.Interfaces;
using PCS.Application.Identity.Interfaces;
using PCS.Application.Projects.Interfaces;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Licensing.Interfaces;

using PCS.Infrastructure.BackgroundJobs;
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

        services.AddDbContext<PCSDbContext>(
            options =>
            {
                if (IsSqlServerConnectionString(connectionString))
                {
                    options.UseSqlServer(connectionString);
                }
                else
                {
                    options.UseSqlite(connectionString);
                }
            });


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


        // ==========================
        // Background Jobs
        // ==========================

        services.AddScoped<
            IBackgroundJobService,
            HangfireBackgroundJobService>();


        return services;
    }


    private static bool IsSqlServerConnectionString(
        string connectionString)
    {
        string value =
            connectionString.Trim();


        // ========================================
        // SQL Server connection string indicators
        // ========================================

        if (value.Contains(
                "Server=",
                StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }


        if (value.Contains(
                "Data Source=",
                StringComparison.OrdinalIgnoreCase) &&
            !value.Contains(
                ".db",
                StringComparison.OrdinalIgnoreCase) &&
            !value.Contains(
                ".sqlite",
                StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }


        if (value.Contains(
                "Initial Catalog=",
                StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }


        if (value.Contains(
                "Trusted_Connection=",
                StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }


        if (value.Contains(
                "Integrated Security=",
                StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }


        // ========================================
        // Otherwise treat as SQLite
        // ========================================

        return false;
    }
}