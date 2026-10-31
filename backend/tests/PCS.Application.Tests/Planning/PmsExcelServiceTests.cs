using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using Xunit;

namespace PCS.Application.Tests.Planning;

public sealed class PmsExcelServiceTests
{
    [Fact]
    public async Task ReadPmsExcelAsync_AllowsParentRowsAfterChildRows()
    {
        var path = CreateWorkbook(workbook =>
        {
            var sheet = workbook.Worksheets.Add("WBS");
            sheet.Cell(1, 1).Value = "Code";
            sheet.Cell(1, 2).Value = "ParentCode";
            sheet.Cell(1, 3).Value = "Name";
            sheet.Cell(1, 4).Value = "Level";

            sheet.Cell(2, 1).Value = "WBS-01-01";
            sheet.Cell(2, 2).Value = "WBS-01";
            sheet.Cell(2, 3).Value = "Child";
            sheet.Cell(2, 4).Value = 2;

            sheet.Cell(3, 1).Value = "WBS-01";
            sheet.Cell(3, 2).Value = string.Empty;
            sheet.Cell(3, 3).Value = "Root";
            sheet.Cell(3, 4).Value = 1;
        });

        try
        {
            var service = new PmsExcelService(new StubExporter());
            var result = await service.ReadPmsExcelAsync(path);

            Assert.Equal(2, result.WbsNodes.Count);
            Assert.Equal("WBS-01-01", result.WbsNodes[0].Code);
            Assert.Equal("WBS-01", result.WbsNodes[0].ParentCode);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task ReadPmsExcelAsync_RejectsIndirectParentCycles()
    {
        var path = CreateWorkbook(workbook =>
        {
            var sheet = workbook.Worksheets.Add("WBS");
            sheet.Cell(1, 1).Value = "Code";
            sheet.Cell(1, 2).Value = "ParentCode";
            sheet.Cell(1, 3).Value = "Name";
            sheet.Cell(1, 4).Value = "Level";

            sheet.Cell(2, 1).Value = "WBS-A";
            sheet.Cell(2, 2).Value = "WBS-B";
            sheet.Cell(2, 3).Value = "A";
            sheet.Cell(2, 4).Value = 1;

            sheet.Cell(3, 1).Value = "WBS-B";
            sheet.Cell(3, 2).Value = "WBS-A";
            sheet.Cell(3, 3).Value = "B";
            sheet.Cell(3, 4).Value = 2;
        });

        try
        {
            var service = new PmsExcelService(new StubExporter());

            var exception = await Assert.ThrowsAsync<Exception>(
                () => service.ReadPmsExcelAsync(path));

            Assert.Contains("cycle", exception.Message, StringComparison.OrdinalIgnoreCase);
        }
        finally
        {
            File.Delete(path);
        }
    }

    private static string CreateWorkbook(Action<XLWorkbook> configure)
    {
        var path = Path.Combine(
            Path.GetTempPath(),
            $"pcs-pms-{Guid.NewGuid():N}.xlsx");

        using var workbook = new XLWorkbook();
        configure(workbook);
        workbook.SaveAs(path);

        return path;
    }

    private sealed class StubExporter : IPcsProfessionalPmsExporter
    {
        public Task<byte[]> GenerateAsync(ExportPmsDto dto) =>
            Task.FromResult(Array.Empty<byte>());
    }
}
