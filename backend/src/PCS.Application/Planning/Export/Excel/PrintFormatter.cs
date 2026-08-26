using ClosedXML.Excel;

namespace PCS.Application.Planning.Export.Excel;

public sealed class PrintFormatter
{
    public void Apply(
        IXLWorksheet sheet)
    {
        sheet.PageSetup.PageOrientation =
            XLPageOrientation.Landscape;


        sheet.PageSetup.PaperSize =
            XLPaperSize.A4Paper;


        sheet.PageSetup.Margins.Top =
            0.5;


        sheet.PageSetup.Margins.Bottom =
            0.5;


        sheet.PageSetup.Margins.Left =
            0.5;


        sheet.PageSetup.Margins.Right =
            0.5;


        sheet.PageSetup.CenterHorizontally =
            true;


        sheet.SheetView.FreezeRows(1);


        sheet.Columns()
            .AdjustToContents();
    }
}