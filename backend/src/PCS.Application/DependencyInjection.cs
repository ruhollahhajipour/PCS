using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

using PCS.Application.Companies.Interfaces;
using PCS.Application.Companies.Services;

using PCS.Application.Projects.Interfaces;
using PCS.Application.Projects.Services;
using PCS.Application.Projects.Commands.Create;
using PCS.Application.Projects.Queries.GetAll;

using PCS.Application.PMS.Interfaces;
using PCS.Application.PMS.Services;

namespace PCS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        // Register FluentValidation
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);


        // Companies
        services.AddScoped<ICompanyService, CompanyService>();


        // Projects
        services.AddScoped<IProjectService, ProjectService>();

        services.AddScoped<CreateProjectHandler>();

        services.AddScoped<GetProjectsHandler>();


       // PMS
        services.AddScoped<IPmsService, PmsService>();
        services.AddScoped<IPmsExcelService, PmsExcelService>();
        services.AddScoped<IPmsTemplateService, PmsTemplateService>();
        services.AddScoped<IPmsProgressService, PmsProgressService>();
        services.AddScoped<IProgressEntryService, ProgressEntryService>();
        services.AddScoped<IPmsEvmService, PmsEvmService>();
        services.AddScoped<IPmsDashboardService, PmsDashboardService>();
        services.AddScoped<ICpmScheduler, CpmScheduler>();
        services.AddScoped<IPmsGanttService, PmsGanttService>();


        return services;
    }
}