using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class ActivitiesSheetBuilder
{
    public void Build(XLWorkbook workbook, ExportPmsDto dto)
    {
        var sheet = workbook.Worksheets.Add(dto.ActivitiesSheetName);
        sheet.ShowGridLines = false;

        var headers = new[]
        {
            "Code", "WbsCode", "Name", "Duration", "PlannedStart", "PlannedFinish",
            "ActualStart", "ActualFinish", "Budget", "Weight", "Progress",
            "RemainingDuration", "Status", "IsMilestone"
        };

        for (var i = 0; i < headers.Length; i++)
            sheet.Cell(1, i + 1).Value = headers[i];

        var row = 2;
        foreach (var item in dto.Activities ?? new List<ActivityDto>())
        {
            sheet.Cell(row, 1).Value = item.Code;
            sheet.Cell(row, 2).Value = item.WbsCode;
            sheet.Cell(row, 3).Value = item.Name;
            sheet.Cell(row, 4).Value = item.Duration;
            if (item.PlannedStart.HasValue) sheet.Cell(row, 5).Value = item.PlannedStart.Value;
            if (item.PlannedFinish.HasValue) sheet.Cell(row, 6).Value = item.PlannedFinish.Value;
            if (item.ActualStart.HasValue) sheet.Cell(row, 7).Value = item.ActualStart.Value;
            if (item.ActualFinish.HasValue) sheet.Cell(row, 8).Value = item.ActualFinish.Value;
            sheet.Cell(row, 9).Value = item.Budget;
            sheet.Cell(row, 10).Value = item.Weight / 100m;
            sheet.Cell(row, 11).Value = item.Progress / 100m;
            sheet.Cell(row, 12).Value = item.RemainingDuration;
            sheet.Cell(row, 13).Value = item.Status;
            sheet.Cell(row, 14).Value = item.IsMilestone;
            row++;
        }

        ApplyFormatting(sheet, dto, row - 1);
    }

    private static void ApplyFormatting(IXLWorksheet sheet, ExportPmsDto dto, int lastRow)
    {
        var theme = ThemePalette.Create(
            dto.ThemePrimaryColor,
            dto.ThemeDarkColor,
            dto.ThemeSecondaryColor,
            dto.ThemeBorderColor);

        var header = sheet.Row(1);
        header.Style.Font.Bold = true;
        header.Style.Font.FontColor = XLColor.White;
        header.Style.Fill.BackgroundColor = XLColor.FromHtml(theme.Dark);
        header.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        header.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        header.Style.Alignment.WrapText = true;

        var usedRange = sheet.RangeUsed();
        if (usedRange != null) usedRange.SetAutoFilter();

        for (var column = 5; column <= 8; column++)
            sheet.Column(column).Style.DateFormat.Format = "yyyy-mm-dd";

        sheet.Columns(10, 11).Style.NumberFormat.Format = "0.00%";
        sheet.Column(9).Style.NumberFormat.Format = "#,##0";
        sheet.Column(12).Style.NumberFormat.Format = "#,##0";
        sheet.SheetView.FreezeRows(1);
        sheet.Columns().AdjustToContents();
        sheet.PageSetup.PageOrientation = XLPageOrientation.Landscape;
        sheet.PageSetup.PaperSize = XLPaperSize.A4Paper;
        sheet.TabColor = XLColor.FromHtml(theme.Primary);
    }
}