using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Builders;

namespace PCS.Application.Tests.Planning.Export;

public sealed class PmsSheetBuilderTests
{
    [Fact]
    public void Build_CreatesSeparatedPcsAndClientBrandingZones()
    {
        using var workbook = new XLWorkbook();
        var dto = new ExportPmsDto
        {
            ProjectName = "EPC Demonstration Project",
            CompanyDisplayName = "Example Client",
            ExportDate = new DateTime(2026, 10, 31, 9, 30, 0, DateTimeKind.Utc),
            HasApprovedBaseline = false
        };

        new PmsSheetBuilder().Build(workbook, dto);

        var sheet = Assert.Single(workbook.Worksheets);

        Assert.Contains("PCS | PROJECT CONTROL SUITE", sheet.Cell("C1").GetString());
        Assert.Contains("EPC Demonstration Project", sheet.Cell("C1").GetString());
        Assert.Contains("Example Client", sheet.Cell("A3").GetString());
        Assert.Contains("Baseline: NOT APPROVED | EVM: N/A", sheet.Cell("A3").GetString());
    }

    [Fact]
    public void Build_ConfiguresA3LandscapeAndRepeatingReportHeader()
    {
        using var workbook = new XLWorkbook();
        var dto = new ExportPmsDto
        {
            ProjectName = "EPC Demonstration Project",
            ExportDate = new DateTime(2026, 10, 31, 9, 30, 0, DateTimeKind.Utc)
        };

        new PmsSheetBuilder().Build(workbook, dto);

        var sheet = Assert.Single(workbook.Worksheets);

        Assert.Equal(XLPageOrientation.Landscape, sheet.PageSetup.PageOrientation);
        Assert.Equal(XLPaperSize.A3Paper, sheet.PageSetup.PaperSize);
        Assert.Equal(1, sheet.PageSetup.FirstRowToRepeatAtTop);
        Assert.Equal(7, sheet.PageSetup.LastRowToRepeatAtTop);
    }
}
