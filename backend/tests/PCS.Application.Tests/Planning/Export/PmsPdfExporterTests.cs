using System.Text;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Pdf;
using QuestPDF.Infrastructure;

namespace PCS.Application.Tests.Planning.Export;

public sealed class PmsPdfExporterTests
{
    static PmsPdfExporterTests()
    {
        QuestPDF.Settings.License = LicenseType.Community;
        QuestPDF.Settings.UseSystemFonts = true;
        QuestPDF.Settings.ThrowOnMissingFontFamilies = false;
        QuestPDF.Settings.ThrowOnMissingTextGlyphs = true;
    }

    [Fact]
    public void Generate_CreatesPdfWithPersianPmsContentAndWbsLinkedActivity()
    {
        var wbsId = Guid.NewGuid();
        var dto = new ExportPmsDto
        {
            ProjectName = "پروژه آزمایشی EPC",
            CompanyDisplayName = "کارفرمای نمونه",
            ExportDate = new DateTime(2026, 10, 31, 9, 30, 0, DateTimeKind.Utc),
            HasApprovedBaseline = true,
            BaselineName = "Approved Baseline",
            BaselineVersion = 1,
            EvmDataDate = new DateTime(2026, 10, 30, 0, 0, 0, DateTimeKind.Utc),
            TotalBudget = 1000m,
            OverallProgress = 65m,
            TotalActivities = 1,
            TotalWbsNodes = 1,
            WbsNodes =
            [
                new WbsNodeDto
                {
                    Id = wbsId,
                    Code = "01",
                    Name = "مهندسی",
                    Level = 1,
                    Budget = 1000m,
                    WeightFactor = 100m,
                    WeightValue = 100m,
                    Progress = 65m,
                    EarnedValue = 650m,
                    PlannedValue = 700m,
                    ActualCost = 600m
                }
            ],
            Activities =
            [
                new ActivityDto
                {
                    Id = Guid.NewGuid(),
                    WbsNodeId = wbsId,
                    WbsCode = "01",
                    WbsLevel = 1,
                    Code = "ENG-001",
                    Name = "تهیه مدارک مهندسی",
                    Budget = 1000m,
                    WeightFactor = 100m,
                    WeightValue = 100m,
                    Progress = 65m,
                    WeightedProgress = 65m,
                    EarnedValue = 650m,
                    PlannedValue = 700m,
                    ActualCost = 600m
                }
            ]
        };

        var pdf = new PmsPdfExporter(new PdfBrandingService()).Generate(dto);

        Assert.True(pdf.Length > 1_000);
        Assert.StartsWith("%PDF-", Encoding.ASCII.GetString(pdf, 0, 5));
        Assert.Contains("%%EOF", Encoding.ASCII.GetString(pdf));
    }
}
