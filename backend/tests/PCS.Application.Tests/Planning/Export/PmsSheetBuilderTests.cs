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

    [Fact]
    public void Build_UsesWbsNodeIdAndConsistentPercentageScalesForActivityRows()
    {
        var wbsId = Guid.NewGuid();
        using var workbook = new XLWorkbook();
        var dto = new ExportPmsDto
        {
            ProjectName = "EPC Demonstration Project",
            TotalBudget = 200m,
            WbsNodes =
            [
                new WbsNodeDto
                {
                    Id = wbsId,
                    Code = "01.02",
                    Name = "Engineering",
                    Level = 1,
                    Budget = 200m,
                    WeightFactor = 100m,
                    WeightValue = 100m,
                    Progress = 40m
                }
            ],
            Activities =
            [
                new ActivityDto
                {
                    Id = Guid.NewGuid(),
                    WbsNodeId = wbsId,
                    WbsCode = "STALE-WBS-CODE",
                    Code = "ENG-001",
                    Name = "Detailed Engineering",
                    Budget = 50m,
                    WeightFactor = 25m,
                    WeightValue = 25m,
                    Progress = 40m,
                    EarnedValue = 20m
                }
            ]
        };

        new PmsSheetBuilder().Build(workbook, dto);

        var sheet = Assert.Single(workbook.Worksheets);

        // Row 8 is the WBS node; its assigned activity must immediately follow.
        Assert.Equal("01.02", sheet.Cell(8, 1).GetString());
        Assert.Equal("ENG-001", sheet.Cell(9, 1).GetString());
        Assert.Equal("01.02", sheet.Cell(9, 2).GetString());
        Assert.Equal("Activity", sheet.Cell(9, 4).GetString());

        // Excel stores percentages as fractions: W.F 25%, W.V 25%,
        // progress 40%, and weighted project progress 10%.
        Assert.Equal(0.25m, sheet.Cell(9, 7).GetValue<decimal>());
        Assert.Equal(0.25m, sheet.Cell(9, 8).GetValue<decimal>());
        Assert.Equal(0.40m, sheet.Cell(9, 9).GetValue<decimal>());
        Assert.Equal(0.10m, sheet.Cell(9, 10).GetValue<decimal>());
    }
}
