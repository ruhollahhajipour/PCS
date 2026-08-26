using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class DashboardSheetBuilder
{
    public void Build(
        XLWorkbook workbook,
        ExportPmsDto dto)
    {
        var sheet =
            workbook.Worksheets.Add("Dashboard");


        sheet.ShowGridLines = false;



        var theme =
            ThemePalette.Create(
                dto.ThemePrimaryColor,
                dto.ThemeDarkColor,
                dto.ThemeSecondaryColor,
                dto.ThemeBorderColor);





        // ==============================
        // Layout
        // ==============================

        sheet.Column("A").Width = 20;
        sheet.Column("B").Width = 18;
        sheet.Column("C").Width = 4;

        sheet.Column("D").Width = 20;
        sheet.Column("E").Width = 18;
        sheet.Column("F").Width = 4;

        sheet.Column("G").Width = 20;
        sheet.Column("H").Width = 18;





        // ==============================
        // Header
        // ==============================

        sheet.Range("A1:H3")
            .Merge();



        var title =
            sheet.Cell("A1");



        title.Value =
            "PCS PROFESSIONAL PMS DASHBOARD";



        title.Style.Font.Bold = true;

        title.Style.Font.FontSize = 24;

        title.Style.Font.FontColor =
            XLColor.White;



        title.Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Dark);



        title.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;



        title.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;








        // ==============================
        // Project Information
        // ==============================


        sheet.Range("A5:B5")
            .Merge();


        sheet.Cell("A5")
            .Value =
            "PROJECT INFORMATION";



        StyleHeader(
            sheet.Range("A5:B5"),
            theme);




        var info =
            new[]
            {
                ("Project",dto.ProjectName),
                ("Client",dto.ClientName),
                ("Contractor",dto.ContractorName),
                ("Consultant",dto.ConsultantName)
            };



        int infoRow = 6;



        foreach(var item in info)
        {
            sheet.Cell(infoRow,1)
                .Value =
                item.Item1;



            sheet.Cell(infoRow,2)
                .Value =
                item.Item2;



            infoRow++;
        }



        FormatBlock(
            sheet.Range("A6:B9"));








        // ==============================
        // KPI Cards
        // ==============================


        CreateCard(
            sheet,
            "A12:B12",
            "TOTAL BUDGET",
            "=SUM(WBS!E:E)",
            "#,##0",
            theme);



        CreateCard(
            sheet,
            "D12:E12",
            "OVERALL PROGRESS",
            "=SUMPRODUCT(WBS!F:F,WBS!G:G)",
            "0.00%",
            theme);



        CreateCard(
            sheet,
            "G12:H12",
            "ACTIVITIES",
            "=COUNTA(Activities!A:A)-1",
            "0",
            theme);




        CreateCard(
            sheet,
            "A16:B16",
            "EARNED VALUE",
            "=SUM(WBS!I:I)",
            "#,##0",
            theme);



        CreateCard(
            sheet,
            "D16:E16",
            "CPI",
            "=IF(SUM(WBS!K:K)=0,0,SUM(WBS!I:I)/SUM(WBS!K:K))",
            "0.00",
            theme);



        CreateCard(
            sheet,
            "G16:H16",
            "SPI",
            "=IF(SUM(WBS!J:J)=0,0,SUM(WBS!I:I)/SUM(WBS!J:J))",
            "0.00",
            theme);








        // ==============================
        // EVM
        // ==============================


        sheet.Range("A20:H20")
            .Merge();



        sheet.Cell("A20")
            .Value =
            "EARNED VALUE MANAGEMENT";



        StyleHeader(
            sheet.Range("A20:H20"),
            theme);




        sheet.Cell("A22")
            .Value="PV";


        sheet.Cell("B22")
            .FormulaA1 =
            "=SUM(WBS!J:J)";



        sheet.Cell("D22")
            .Value="EV";



        sheet.Cell("E22")
            .FormulaA1 =
            "=SUM(WBS!I:I)";



        sheet.Cell("G22")
            .Value="AC";



        sheet.Cell("H22")
            .FormulaA1 =
            "=SUM(WBS!K:K)";



        FormatBlock(
            sheet.Range("A22:H22"));









        // ==============================
        // WBS Progress
        // ==============================


        sheet.Range("A25:H25")
            .Merge();



        sheet.Cell("A25")
            .Value =
            "WBS PROGRESS SUMMARY";



        StyleHeader(
            sheet.Range("A25:H25"),
            theme);





        sheet.Cell("A26")
            .Value="WBS";


        sheet.Cell("B26")
            .Value="Progress";



        sheet.Range("A26:B26")
            .Style.Font.Bold=true;



        int row = 27;



        foreach(var node in dto.WbsNodes)
        {
            sheet.Cell(row,1)
                .Value =
                node.Name;



            sheet.Cell(row,2)
                .FormulaA1 =
                $"=SUMIFS(WBS!G:G,WBS!C:C,A{row})";



            row++;
        }



        sheet.Range(
            $"B27:B{row}")
            .Style.NumberFormat.Format =
            "0.00%";



        FormatBlock(
            sheet.Range($"A26:B{row-1}"));








        // ==============================
        // Footer
        // ==============================


        sheet.Range("A35:H35")
            .Merge();



        sheet.Cell("A35")
            .Value =
            "Generated automatically by PCS Project Control Suite";



        sheet.Cell("A35")
            .Style.Font.Italic=true;



        sheet.PageSetup.PageOrientation =
            XLPageOrientation.Landscape;



        sheet.PageSetup.PaperSize =
            XLPaperSize.A4Paper;



        sheet.PageSetup.PagesWide=1;



        sheet.SheetView.FreezeRows(3);



        sheet.TabColor =
            XLColor.FromHtml(theme.Primary);
    }








    private static void CreateCard(
        IXLWorksheet sheet,
        string range,
        string title,
        string formula,
        string format,
        ThemePalette theme)
    {

        var header =
            sheet.Range(range);



        header.Merge();



        header.FirstCell()
            .Value =
            title;



        header.Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Primary);



        header.Style.Font.Bold=true;



        header.Style.Font.FontColor =
            XLColor.White;





        int row =
            header.RangeAddress
            .FirstAddress
            .RowNumber + 1;



        int col =
            header.RangeAddress
            .FirstAddress
            .ColumnNumber;




        sheet.Range(
            row,
            col,
            row,
            col+1)
            .Merge();




        var valueCell =
            sheet.Cell(row,col);




        valueCell.FormulaA1 =
            formula;



        valueCell.Style.Font.Bold=true;



        valueCell.Style.Font.FontSize=18;



        valueCell.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;



        valueCell.Style.NumberFormat.Format =
            format;



        sheet.Range(
            row,
            col,
            row,
            col+1)
            .Style.Border.OutsideBorder =
            XLBorderStyleValues.Thin;
    }







    private static void StyleHeader(
        IXLRange range,
        ThemePalette theme)
    {
        range.Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Dark);



        range.Style.Font.FontColor =
            XLColor.White;



        range.Style.Font.Bold=true;



        range.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;
    }







    private static void FormatBlock(
        IXLRange range)
    {
        range.Style.Border.OutsideBorder =
            XLBorderStyleValues.Thin;



        range.Style.Border.InsideBorder =
            XLBorderStyleValues.Thin;



        range.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;
    }
}