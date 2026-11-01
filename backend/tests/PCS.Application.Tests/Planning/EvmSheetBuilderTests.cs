using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Builders;

namespace PCS.Application.Tests.Planning;

public sealed class EvmSheetBuilderTests
{
    [Fact]
    public void Build_UsesCorrectWbsColumnsAndAddsForecastMetrics()
    {
        using var workbook = new XLWorkbook();

        new EvmSheetBuilder().Build(workbook, new ExportPmsDto());

        var sheet = workbook.Worksheet("EVM");

        Assert.Equal("SUMIF(WBS!D:D,0,WBS!K:K)", sheet.Cell("B9").FormulaA1);
        Assert.Equal("SUMIF(WBS!D:D,0,WBS!J:J)", sheet.Cell("B10").FormulaA1);
        Assert.Equal("SUMIF(WBS!D:D,0,WBS!L:L)", sheet.Cell("B11").FormulaA1);
        Assert.Equal("SUMIF(WBS!D:D,0,WBS!E:E)", sheet.Cell("B12").FormulaA1);
        Assert.Equal("IF(B15=0,\"\",B12/B15)", sheet.Cell("B17").FormulaA1);
        Assert.Equal("IF(B17=\"\",\"\",B17-B11)", sheet.Cell("B18").FormulaA1);
        Assert.Equal("IF(B17=\"\",\"\",B12-B17)", sheet.Cell("B19").FormulaA1);
    }
}
