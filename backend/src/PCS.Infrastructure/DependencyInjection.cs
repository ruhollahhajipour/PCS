using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using PCS.Application.Common.Interfaces;
using PCS.Application.Projects.Interfaces;
using PCS.Application.PMS.Interfaces;

using PCS.Infrastructure.BackgroundJobs;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Repositories;
using PCS.Infrastructure.Services;

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

        services.AddDbContext<PCSDbContext>(options =>
        {
            options.UseSqlite(
                configuration.GetConnectionString(
                    "DefaultConnection"));
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
        // Services
        // ==========================

        services.AddScoped<
            IAuditService,
            AuditService>();



        // ==========================
        // Background Jobs
        // ==========================

        services.AddScoped<
            IBackgroundJobService,
            HangfireBackgroundJobService>();


        return services;
    }
}