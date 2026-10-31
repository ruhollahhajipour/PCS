using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class ProgressSheetBuilder
{
    public void Build(
        XLWorkbook workbook,
        ExportPmsDto dto)
    {
        var sheet =
            workbook.Worksheets.Add("Progress");


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

        sheet.Range("A1:L2")
            .Merge();



        var title =
            sheet.Cell("A1");



        title.Value =
            "PCS PROJECT PROGRESS REPORT";



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
        // Summary
        // ==========================


        int total =
            dto.Activities.Count;



        int completed =
            dto.Activities.Count(x =>
                x.Progress >= 100);



        int inProgress =
            dto.Activities.Count(x =>
                x.Progress > 0 &&
                x.Progress < 100);



        int notStarted =
            dto.Activities.Count(x =>
                x.Progress <= 0);




        sheet.Cell("A4")
            .Value =
            "Total Activities";


        sheet.Cell("B4")
            .Value =
            total;




        sheet.Cell("D4")
            .Value =
            "Completed";


        sheet.Cell("E4")
            .Value =
            completed;




        sheet.Cell("G4")
            .Value =
            "In Progress";


        sheet.Cell("H4")
            .Value =
            inProgress;




        sheet.Cell("J4")
            .Value =
            "Not Started";


        sheet.Cell("K4")
            .Value =
            notStarted;




        sheet.Cell("A5")
            .Value =
            "Overall Progress";



        sheet.Cell("B5")
            .Value =
            dto.OverallProgress / 100;



        sheet.Cell("B5")
            .Style.NumberFormat.Format =
            "0.00%";



        FormatBlock(
            sheet.Range("A4:K5"));







        // ==========================
        // Activity Table Header
        // ==========================

        var headers =
            new[]
            {
                "Code",
                "WBS",
                "Activity",
                "Start",
                "Finish",
                "Duration",
                "Weight",
                "Progress",
                "Budget",
                "Actual Cost",
                "EV",
                "Status"
            };



        int headerRow = 8;



        for(int i = 0; i < headers.Length; i++)
        {
            sheet.Cell(
                headerRow,
                i + 1)
                .Value =
                headers[i];
        }






        // ==========================
        // Activity Rows
        // ==========================

        int row =
            headerRow + 1;



        foreach(var activity in dto.Activities)
        {
            sheet.Cell(row,1)
                .Value =
                activity.Code;



            sheet.Cell(row,2)
                .Value =
                activity.WbsCode;



            sheet.Cell(row,3)
                .Value =
                activity.Name;



            sheet.Cell(row,4)
                .Value =
                activity.PlannedStart;



            sheet.Cell(row,5)
                .Value =
                activity.PlannedFinish;



            sheet.Cell(row,6)
                .Value =
                activity.Duration;



            sheet.Cell(row,7)
                .Value =
                activity.Weight / 100;



            sheet.Cell(row,8)
                .Value =
                activity.Progress / 100;



            sheet.Cell(row,9)
                .Value =
                activity.Budget;



            sheet.Cell(row,10)
                .Value =
                activity.ActualCost;



            sheet.Cell(row,11)
                .Value =
                activity.EarnedValue;



            sheet.Cell(row,12)
                .Value =
                GetStatus(activity.Progress);



            row++;
        }






        sheet.Range(
            headerRow,
            1,
            row - 1,
            12)
            .Style.Border.OutsideBorder =
            XLBorderStyleValues.Thin;





        FormatHeader(
            sheet.Range("A8:L8"),
            theme);




        sheet.Column(7)
            .Style.NumberFormat.Format =
            "0.00%";



        sheet.Column(8)
            .Style.NumberFormat.Format =
            "0.00%";



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







    private static string GetStatus(
        decimal progress)
    {
        if(progress >= 100)
            return "Completed";


        if(progress > 0)
            return "In Progress";


        return "Not Started";
    }







    private static void FormatHeader(
        IXLRange range,
        ThemePalette theme)
    {
        range.Style.Font.Bold = true;



        range.Style.Font.FontColor =
            XLColor.White;



        range.Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Primary);



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



        range.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;
    }
}