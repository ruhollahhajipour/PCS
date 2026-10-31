using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Builders;
using Xunit;

namespace PCS.Application.Tests.Planning;

public sealed class PmsSheetBuilderTests
{
    [Fact]
    public void Build_CalculatesWeightedProgressIndependentlyOfEarnedValue()
    {
        using var workbook = new XLWorkbook();

        var wbs = new WbsNodeDto
        {
            Id = Guid.NewGuid(),
            Code = "WBS-01",
            Name = "Engineering",
            Level = 1,
            Budget = 100m,
            WeightValue = 100m,
            Progress = 50m
        };

        var activity = new ActivityDto
        {
            Id = Guid.NewGuid(),
            Code = "ACT-001",
            Name = "Prepare engineering package",
            WbsNodeId = wbs.Id,
            WbsCode = "WBS-01",
            WbsLevel = 1,
            Budget = 100m,
            WeightValue = 100m,
            Progress = 50m,
            EarnedValue = 0m
        };

        var dto = new ExportPmsDto
        {
            ProjectName = "PCS Test Project",
            TotalActivities = 1,
            TotalWbsNodes = 1,
            TotalBudget = 100m,
            OverallProgress = 50m,
            WbsNodes = new List<WbsNodeDto> { wbs },
            Activities = new List<ActivityDto> { activity }
        };

        new PmsSheetBuilder().Build(workbook, dto);

        var sheet = workbook.Worksheet("PMS");

        Assert.Equal(0.5m, sheet.Cell(8, 10).GetValue<decimal>());
        Assert.Equal(0.5m, sheet.Cell(9, 10).GetValue<decimal>());
    }
    [Fact]
    public void Build_AssignsActivityByWbsIdWhenDisplayCodeIsStale()
    {
        using var workbook = new XLWorkbook();

        var wbs = new WbsNodeDto
        {
            Id = Guid.NewGuid(),
            Code = "WBS-01",
            Name = "Engineering",
            Level = 1,
            Budget = 100m,
            WeightValue = 100m,
            Progress = 50m
        };

        var activity = new ActivityDto
        {
            Id = Guid.NewGuid(),
            Code = "ACT-STALE-CODE",
            Name = "Activity linked by persisted WBS ID",
            WbsNodeId = wbs.Id,
            WbsCode = "OLD-DISPLAY-CODE",
            Budget = 100m,
            WeightValue = 100m,
            Progress = 50m
        };

        var dto = new ExportPmsDto
        {
            ProjectName = "PCS Test Project",
            TotalActivities = 1,
            TotalWbsNodes = 1,
            TotalBudget = 100m,
            OverallProgress = 50m,
            WbsNodes = [wbs],
            Activities = [activity]
        };

        new PmsSheetBuilder().Build(workbook, dto);

        var sheet = workbook.Worksheet("PMS");

        Assert.Equal("ACT-STALE-CODE", sheet.Cell(9, 1).GetString());
        Assert.Equal("WBS-01", sheet.Cell(9, 2).GetString());
        Assert.Equal("Activity", sheet.Cell(9, 4).GetString());
    }
}
