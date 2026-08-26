using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

using PCS.Application.Companies.Interfaces;
using PCS.Application.Companies.Services;

using PCS.Application.Projects.Interfaces;
using PCS.Application.Projects.Services;
using PCS.Application.Projects.Commands.Create;
using PCS.Application.Projects.Queries.GetAll;

using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;

using PCS.Application.Planning.Export;
using PCS.Application.Planning.Export.Excel;
using PCS.Application.Planning.Export.Excel.Builders;

namespace PCS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        // FluentValidation
        services.AddValidatorsFromAssembly(
            typeof(DependencyInjection).Assembly);



        // ==========================
        // Companies
        // ==========================

        services.AddScoped<
            ICompanyService,
            CompanyService>();



        // ==========================
        // Projects
        // ==========================

        services.AddScoped<
            IProjectService,
            ProjectService>();


        services.AddScoped<
            CreateProjectHandler>();


        services.AddScoped<
            GetProjectsHandler>();



        // ==========================
        // PMS
        // ==========================

        services.AddScoped<
            IPmsService,
            PmsService>();


        services.AddScoped<
            IPmsExcelService,
            PmsExcelService>();


        services.AddScoped<
            IPmsTemplateService,
            PmsTemplateService>();


        services.AddScoped<
            IPmsProgressService,
            PmsProgressService>();


        services.AddScoped<
            IProgressEntryService,
            ProgressEntryService>();


        services.AddScoped<
            IPmsEvmService,
            PmsEvmService>();


        services.AddScoped<
            IPmsDashboardService,
            PmsDashboardService>();

        services.AddScoped<
           IPmsCalculationService,
           PmsCalculationService>();

        services.AddScoped<
            ICpmScheduler,
            CpmScheduler>();


        services.AddScoped<
            IPmsGanttService,
            PmsGanttService>();



// ==========================
// PMS Excel Export Builders
// ==========================

        services.AddScoped<CoverSheetBuilder>();

        services.AddScoped<DashboardSheetBuilder>();

        services.AddScoped<WbsSheetBuilder>();

        services.AddScoped<ActivitiesSheetBuilder>();

        services.AddScoped<ProgressSheetBuilder>();

        services.AddScoped<EvmSheetBuilder>();

        services.AddScoped<PmsSheetBuilder>();

        services.AddScoped<
         IWbsCalculationService,
         WbsCalculationService>();

        services.AddScoped<
          IPcsProfessionalPmsExporter,
          PcsProfessionalPmsExcelExporter>();

        return services;
    }
}