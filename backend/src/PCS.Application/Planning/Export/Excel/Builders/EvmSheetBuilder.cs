using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class EvmSheetBuilder
{
    public void Build(
        XLWorkbook workbook,
        ExportPmsDto dto)
    {
        var sheet =
            workbook.Worksheets.Add("EVM");


        sheet.ShowGridLines = false;



        var theme =
            ThemePalette.Create(
                dto.ThemePrimaryColor,
                dto.ThemeDarkColor,
                dto.ThemeSecondaryColor,
                dto.ThemeBorderColor);




        // ==========================
        // Title
        // ==========================

        sheet.Range("A1:D2")
            .Merge();



        var title =
            sheet.Cell("A1");



        title.Value =
            "PCS PROFESSIONAL EARNED VALUE MANAGEMENT";



        title.Style.Font.Bold = true;


        title.Style.Font.FontSize = 18;



        title.Style.Font.FontColor =
            XLColor.White;



        title.Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Dark);



        title.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;



        title.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;






        // ==========================
        // Project Info
        // ==========================


        sheet.Cell("A4")
            .Value = "Project";



        sheet.Cell("B4")
            .Value = dto.ProjectName;




        sheet.Cell("A5")
            .Value = "Report Date";



        sheet.Cell("B5")
            .Value = dto.ExportDate;



        sheet.Cell("B5")
            .Style.DateFormat.Format =
            "yyyy-MM-dd";



        FormatBlock(
            sheet.Range("A4:B5"));








        // ==========================
        // EVM Table
        // ==========================


        sheet.Cell("A8")
            .Value = "Metric";


        sheet.Cell("B8")
            .Value = "Value";


        sheet.Cell("C8")
            .Value = "Status";



        var rows =
            new[]
            {
                ("Planned Value (PV)",
                 "=SUMIF(WBS!D:D,0,WBS!K:K)"),

                ("Earned Value (EV)",
                 "=SUMIF(WBS!D:D,0,WBS!J:J)"),

                ("Actual Cost (AC)",
                 "=SUMIF(WBS!D:D,0,WBS!L:L)"),

                ("Budget at Completion (BAC)",
                 "=SUMIF(WBS!D:D,0,WBS!E:E)"),

                ("Cost Variance (CV)",
                 "=B10-B11"),

                ("Schedule Variance (SV)",
                 "=B10-B9"),

                ("Cost Performance Index (CPI)",
                 "=IF(B11=0,0,B10/B11)"),

                ("Schedule Performance Index (SPI)",
                 "=IF(B9=0,0,B10/B9)"),

                ("Estimate at Completion (EAC)",
                 "=IF(B15=0,\"\",B12/B15)"),

                ("Estimate to Complete (ETC)",
                 "=IF(B17=\"\",\"\",B17-B11)"),

                ("Variance at Completion (VAC)",
                 "=IF(B17=\"\",\"\",B12-B17)")
            };



        int row = 9;



        foreach(var item in rows)
        {
            sheet.Cell(row,1)
                .Value = item.Item1;



            sheet.Cell(row,2)
                .FormulaA1 = item.Item2;




            if(item.Item1.Contains("CPI") ||
               item.Item1.Contains("SPI"))
            {
                sheet.Cell(row,3)
                    .FormulaA1 =
                    $"=IF(B{row}>=1,\"GOOD\",\"WARNING\")";
            }
            else
            {
                sheet.Cell(row,3)
                    .Value = "-";
            }


            row++;
        }




        FormatBlock(
            sheet.Range("A8:C19"));




        // ==========================
        // Header Styling
        // ==========================

        sheet.Range("A8:C8")
            .Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Primary);



        sheet.Range("A8:C8")
            .Style.Font.FontColor =
            XLColor.White;



        sheet.Range("A8:C8")
            .Style.Font.Bold = true;







        // ==========================
        // Number Formats
        // ==========================


        sheet.Range("B9:B14")
            .Style.NumberFormat.Format =
            "#,##0.00";



        sheet.Range("B15:B16")
            .Style.NumberFormat.Format =
            "0.00";







        // ==========================
        // Indicators
        // ==========================

        foreach (var cell in new[] { "B15", "B16" })
        {
            sheet.Cell(cell)
                .AddConditionalFormat()
                .WhenLessThan(1)
                .Fill
                .SetBackgroundColor(XLColor.LightPink);

            sheet.Cell(cell)
                .AddConditionalFormat()
                .WhenGreaterThan(1)
                .Fill
                .SetBackgroundColor(XLColor.LightGreen);
        }

        sheet.Range("B17:B19")
            .Style.NumberFormat.Format = "#,##0.00";


        // ==========================
        // Layout
        // ==========================


        sheet.Columns()
            .AdjustToContents();



        sheet.SheetView
            .FreezeRows(8);




        sheet.PageSetup.PageOrientation =
            XLPageOrientation.Landscape;



        sheet.PageSetup.PaperSize =
            XLPaperSize.A4Paper;



        sheet.PageSetup.PagesWide = 1;



        sheet.TabColor =
            XLColor.FromHtml(theme.Primary);
    }







    private static void FormatBlock(
        IXLRange range)
    {
        range.Style.Border.OutsideBorder =
            XLBorderStyleValues.Thin;



        range.Style.Border.InsideBorder =
            XLBorderStyleValues.Thin;



        range.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;



        range.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;
    }
}