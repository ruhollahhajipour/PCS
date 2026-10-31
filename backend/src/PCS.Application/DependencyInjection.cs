using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using QuestPDF.Infrastructure;

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
using PCS.Application.Planning.Export.Pdf;

using PCS.Application.Plants.Interfaces;
using PCS.Application.Plants.Services; 

namespace PCS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        // PCS legal entity confirmed eligibility for QuestPDF Community.
        QuestPDF.Settings.License = LicenseType.Community;
        QuestPDF.Settings.UseSystemFonts = true;
        QuestPDF.Settings.ThrowOnMissingFontFamilies = false;
        QuestPDF.Settings.ThrowOnMissingTextGlyphs = true;

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
// Plants
// ==========================

services.AddScoped<
    IPlantService,
    PlantService>();


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
            IPmsBaselineService,
            PmsBaselineService>();


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

        services.AddScoped<
            IActivityRelationshipService,
            ActivityRelationshipService>();



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

        services.AddSingleton<PdfBrandingService>();
        services.AddScoped<IPmsPdfExporter, PmsPdfExporter>();

        services.AddScoped<
         IWbsCalculationService,
         WbsCalculationService>();

        services.AddScoped<
          IPcsProfessionalPmsExporter,
          PcsProfessionalPmsExcelExporter>();

        return services;
    }
}