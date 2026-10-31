using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class ActivitiesSheetBuilder
{
    public void Build(
        XLWorkbook workbook,
        ExportPmsDto dto)
    {
        var sheet =
            workbook.Worksheets.Add(
                dto.ActivitiesSheetName);



        sheet.ShowGridLines = false;



        var headers =
            new[]
            {
                "Code",
                "WBS",
                "Activity",
                "Duration",
                "Start",
                "Finish",
                "Budget",
                "Weight",
                "Progress %",
                "Weighted Progress",
                "EV",
                "PV",
                "AC",
                "CPI",
                "SPI"
            };



        for(int i = 0; i < headers.Length; i++)
        {
            sheet.Cell(1,i+1)
                .Value =
                headers[i];
        }




        int row = 2;



        foreach(var item in dto.Activities
                ?? new List<ActivityDto>())
        {
            sheet.Cell(row,1).Value = item.Code;

            sheet.Cell(row,2).Value = item.WbsCode;

            sheet.Cell(row,3).Value = item.Name;

            sheet.Cell(row,4).Value = item.Duration;



            if(item.PlannedStart.HasValue)
            {
                sheet.Cell(row,5)
                    .Value =
                    item.PlannedStart.Value;
            }



            if(item.PlannedFinish.HasValue)
            {
                sheet.Cell(row,6)
                    .Value =
                    item.PlannedFinish.Value;
            }



            sheet.Cell(row,7)
                .Value =
                item.Budget;



            sheet.Cell(row,8)
                .Value =
                item.Weight / 100m;



            sheet.Cell(row,9)
                .Value =
                item.Progress / 100m;



            sheet.Cell(row,10)
                .FormulaA1 =
                $"=H{row}*I{row}";



            sheet.Cell(row,11)
                .FormulaA1 =
                $"=G{row}*I{row}";



            sheet.Cell(row,12)
                .FormulaA1 =
                $"=G{row}*0.5";



            sheet.Cell(row,13)
                .Value =
                item.ActualCost;



            sheet.Cell(row,14)
                .FormulaA1 =
                $"=IF(M{row}=0,0,K{row}/M{row})";



            sheet.Cell(row,15)
                .FormulaA1 =
                $"=IF(L{row}=0,0,K{row}/L{row})";



            row++;
        }




        ApplyFormatting(
            sheet,
            dto,
            row - 1);
    }







    private static void ApplyFormatting(
        IXLWorksheet sheet,
        ExportPmsDto dto,
        int lastRow)
    {

        var theme =
            ThemePalette.Create(
                dto.ThemePrimaryColor,
                dto.ThemeDarkColor,
                dto.ThemeSecondaryColor,
                dto.ThemeBorderColor);




        var header =
            sheet.Row(1);



        header.Style.Font.Bold = true;



        header.Style.Font.FontColor =
            XLColor.White;



        header.Style.Fill.BackgroundColor =
            XLColor.FromHtml(
                theme.Dark);



        header.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;



        header.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;





        var usedRange = sheet.RangeUsed();

         if (usedRange != null)
        {
         usedRange.SetAutoFilter();
         }  



        sheet.Column(5)
            .Style.DateFormat.Format =
            "yyyy-mm-dd";



        sheet.Column(6)
            .Style.DateFormat.Format =
            "yyyy-mm-dd";




        sheet.Columns(8,10)
            .Style.NumberFormat.Format =
            "0.00%";




        sheet.Columns(14,15)
            .Style.NumberFormat.Format =
            "0.00";




        sheet.Column(7)
            .Style.NumberFormat.Format =
            "#,##0";




        sheet.Columns(11,13)
            .Style.NumberFormat.Format =
            "#,##0";




        sheet.SheetView
            .FreezeRows(1);



        sheet.Columns()
            .AdjustToContents();




        sheet.PageSetup.PageOrientation =
            XLPageOrientation.Landscape;



        sheet.PageSetup.PaperSize =
            XLPaperSize.A4Paper;



        sheet.TabColor =
            XLColor.FromHtml(
                theme.Primary);
    }
}