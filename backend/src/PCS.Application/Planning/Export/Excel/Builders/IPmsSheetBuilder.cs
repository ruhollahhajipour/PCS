using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Export.Excel.Builders;

public interface IPmsSheetBuilder
{
    void Build(
        XLWorkbook workbook,
        ExportPmsDto dto);
}
