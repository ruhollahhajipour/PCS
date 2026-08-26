using ClosedXML.Excel;

namespace PCS.Application.Planning.Export.Excel.Builders;

public interface IPmsSheetBuilder
{
    void Build(
        XLWorkbook workbook);
}