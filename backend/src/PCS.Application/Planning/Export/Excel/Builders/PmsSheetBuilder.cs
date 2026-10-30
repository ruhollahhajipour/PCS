using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

/// <summary>
/// Builds the consolidated PCS PMS register. WBS rows are emitted
/// recursively and each activity is placed directly under its owning WBS.
/// </summary>
public sealed class PmsSheetBuilder
{
    private const int HeaderRow = 7;
    private const int FirstDataRow = 8;

    public void Build(XLWorkbook workbook, ExportPmsDto dto)
    {
        ArgumentNullException.ThrowIfNull(workbook);
        ArgumentNullException.ThrowIfNull(dto);

        var sheet = workbook.Worksheets.Add("PMS");
        sheet.ShowGridLines = false;

        var theme = ThemePalette.Create(
            dto.ThemePrimaryColor,
            dto.ThemeDarkColor,
            dto.ThemeSecondaryColor,
            dto.ThemeBorderColor);

        CreateTitle(sheet, dto, theme);
        CreateKpiArea(sheet, dto, theme);
        CreateHeaders(sheet, theme);

        var activitiesByWbs = dto.Activities
            .Where(x => !string.IsNullOrWhiteSpace(x.WbsCode))
            .GroupBy(x => x.WbsCode, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                x => x.Key,
                x => x.OrderBy(a => a.Code, StringComparer.OrdinalIgnoreCase).ToList(),
                StringComparer.OrdinalIgnoreCase);

        var allWbsNodes = dto.WbsNodes
            .SelectMany(GetAllNodes)
            .ToList();

        var wbsCodes = allWbsNodes
            .Select(x => x.Code)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var maxLevel = allWbsNodes
            .Select(x => x.Level)
            .DefaultIfEmpty(1)
            .Max();

        var row = FirstDataRow;
        foreach (var root in dto.WbsNodes
                     .OrderBy(x => x.SortOrder)
                     .ThenBy(x => x.Code, StringComparer.OrdinalIgnoreCase))
        {
            WriteNode(sheet, root, dto, activitiesByWbs, ref row, maxLevel, theme);
        }

        var unassigned = dto.Activities
            .Where(x => string.IsNullOrWhiteSpace(x.WbsCode) ||
                        !wbsCodes.Contains(x.WbsCode))
            .OrderBy(x => x.Code, StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (unassigned.Count > 0)
        {
            WriteSectionRow(sheet, row++, "UNASSIGNED ACTIVITIES", theme);
            foreach (var activity in unassigned)
                WriteActivity(sheet, row++, activity, null, dto, theme);
        }

        ApplyFormatting(sheet, Math.Max(HeaderRow, row - 1), theme);
    }

    private static void CreateTitle(
        IXLWorksheet sheet,
        ExportPmsDto dto,
        ThemePalette theme)
    {
        sheet.Range("A1:O2").Merge();
        var title = sheet.Cell("A1");
        title.Value = $"{dto.ProjectName}\nPROJECT MANAGEMENT SYSTEM";
        title.Style.Font.Bold = true;
        title.Style.Font.FontSize = 17;
        title.Style.Font.FontColor = XLColor.White;
        title.Style.Fill.BackgroundColor = XLColor.FromHtml(theme.Dark);
        title.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        title.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        title.Style.Alignment.WrapText = true;

        var logoPath = ResolveBrandingPath(dto.PlatformLogoPath);
        if (logoPath is not null)
        {
            sheet.AddPicture(logoPath)
                .MoveTo(sheet.Cell("A1"))
                .WithSize(72, 42);
        }

        var companyLogoPath = string.IsNullOrWhiteSpace(dto.CompanyLogoPath)
            ? null
            : ResolveBrandingPath(dto.CompanyLogoPath);
        if (companyLogoPath is not null &&
            !string.Equals(companyLogoPath, logoPath, StringComparison.OrdinalIgnoreCase))
        {
            sheet.AddPicture(companyLogoPath)
                .MoveTo(sheet.Cell("N1"))
                .WithSize(72, 42);
        }

        sheet.Range("A3:O3").Merge();
        var company = sheet.Cell("A3");
        company.Value = string.IsNullOrWhiteSpace(dto.CompanyDisplayName)
            ? dto.ClientName
            : dto.CompanyDisplayName;
        company.Style.Font.Bold = true;
        company.Style.Font.FontSize = 11;
        company.Style.Font.FontColor = XLColor.FromHtml(theme.Dark);
        company.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        company.Style.Border.BottomBorder = XLBorderStyleValues.Medium;
        company.Style.Border.BottomBorderColor = XLColor.FromHtml(theme.Primary);

        sheet.Row(1).Height = 25;
        sheet.Row(2).Height = 25;
        sheet.Row(3).Height = 22;
    }

    private static void CreateKpiArea(
        IXLWorksheet sheet,
        ExportPmsDto dto,
        ThemePalette theme)
    {
        var cards = new[]
        {
            (Start: 1, End: 3, Label: "TOTAL ACTIVITIES", Value: (object)dto.TotalActivities),
            (Start: 4, End: 6, Label: "OVERALL PROGRESS", Value: (object)(dto.OverallProgress / 100m)),
            (Start: 7, End: 9, Label: "TOTAL BUDGET", Value: (object)dto.TotalBudget),
            (Start: 10, End: 12, Label: "CPI", Value: (object)dto.CPI),
            (Start: 13, End: 15, Label: "SPI", Value: (object)dto.SPI)
        };

        foreach (var card in cards)
        {
            sheet.Range(4, card.Start, 4, card.End).Merge();
            sheet.Range(5, card.Start, 5, card.End).Merge();

            var label = sheet.Cell(4, card.Start);
            label.Value = card.Label;
            label.Style.Font.Bold = true;
            label.Style.Font.FontSize = 8;
            label.Style.Font.FontColor = XLColor.White;
            label.Style.Fill.BackgroundColor = XLColor.FromHtml(theme.Primary);
            label.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            var value = sheet.Cell(5, card.Start);
            value.Value = XLCellValue.FromObject(card.Value);
            value.Style.Font.Bold = true;
            value.Style.Font.FontSize = 12;
            value.Style.Font.FontColor = XLColor.FromHtml(theme.Dark);
            value.Style.Fill.BackgroundColor = XLColor.FromHtml("#EFF6FF");
            value.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            value.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            value.Style.Border.OutsideBorderColor = XLColor.FromHtml(theme.Border);

            if (card.Label == "OVERALL PROGRESS")
                value.Style.NumberFormat.Format = "0.00%";
            else if (card.Label == "TOTAL BUDGET")
                value.Style.NumberFormat.Format = "#,##0.00";
            else if (card.Label is "CPI" or "SPI")
                value.Style.NumberFormat.Format = "0.00";
        }

        sheet.Row(4).Height = 18;
        sheet.Row(5).Height = 25;
    }

    private static void CreateHeaders(IXLWorksheet sheet, ThemePalette theme)
    {
        string[] headers =
        {
            "Code", "Parent", "Level", "Type", "Description",
            "Budget", "W.F %", "W.V %", "Progress %",
            "Weighted Progress %", "EV", "PV", "AC", "CPI", "SPI"
        };

        for (var index = 0; index < headers.Length; index++)
            sheet.Cell(HeaderRow, index + 1).Value = headers[index];

        var header = sheet.Range(HeaderRow, 1, HeaderRow, headers.Length);
        header.Style.Font.Bold = true;
        header.Style.Font.FontColor = XLColor.White;
        header.Style.Fill.BackgroundColor = XLColor.FromHtml(theme.Dark);
        header.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        header.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        header.Style.Alignment.WrapText = true;
        sheet.Row(HeaderRow).Height = 32;
    }

    private static void WriteNode(
        IXLWorksheet sheet,
        WbsNodeDto node,
        ExportPmsDto dto,
        IReadOnlyDictionary<string, List<ActivityDto>> activitiesByWbs,
        ref int row,
        int maxLevel,
        ThemePalette theme)
    {
        var currentRow = row++;
        var projectBudget = dto.TotalBudget;

        sheet.Cell(currentRow, 1).Value = node.Code;
        sheet.Cell(currentRow, 2).Value = node.ParentCode ?? string.Empty;
        sheet.Cell(currentRow, 3).Value = node.Level;
        sheet.Cell(currentRow, 4).Value = "WBS";
        sheet.Cell(currentRow, 5).Value = node.Name;
        sheet.Cell(currentRow, 6).Value = node.Budget;
        sheet.Cell(currentRow, 7).Value = node.WeightFactor / 100m;
        sheet.Cell(currentRow, 8).Value = node.WeightValue / 100m;
        sheet.Cell(currentRow, 9).Value = node.Progress / 100m;
        sheet.Cell(currentRow, 10).Value = projectBudget == 0
            ? 0
            : node.EarnedValue / projectBudget;
        sheet.Cell(currentRow, 11).Value = node.EarnedValue;
        sheet.Cell(currentRow, 12).Value = node.PlannedValue;
        sheet.Cell(currentRow, 13).Value = node.ActualCost;
        sheet.Cell(currentRow, 14).Value = node.CPI;
        sheet.Cell(currentRow, 15).Value = node.SPI;

        var levelColor = theme.GetWbsLevelColor(node.Level, maxLevel);
        var wbsRange = sheet.Range(currentRow, 1, currentRow, 15);
        wbsRange.Style.Fill.BackgroundColor = XLColor.FromHtml(levelColor);
        wbsRange.Style.Font.Bold = true;
        if (node.Level <= 1)
            wbsRange.Style.Font.FontColor = XLColor.White;
        sheet.Cell(currentRow, 5).Style.Alignment.Indent = Math.Clamp(node.Level, 0, 15);

        if (activitiesByWbs.TryGetValue(node.Code, out var assignedActivities))
        {
            foreach (var activity in assignedActivities)
                WriteActivity(sheet, row++, activity, node, dto, theme);
        }

        foreach (var child in node.Children
                     .OrderBy(x => x.SortOrder)
                     .ThenBy(x => x.Code, StringComparer.OrdinalIgnoreCase))
        {
            WriteNode(sheet, child, dto, activitiesByWbs, ref row, maxLevel, theme);
        }
    }

    private static void WriteActivity(
        IXLWorksheet sheet,
        int row,
        ActivityDto activity,
        WbsNodeDto? owner,
        ExportPmsDto dto,
        ThemePalette theme)
    {
        var projectBudget = dto.TotalBudget;
        var weightValue = projectBudget == 0
            ? 0
            : activity.Budget / projectBudget;
        var weightFactor = owner is not null && owner.Budget > 0
            ? activity.Budget / owner.Budget
            : 0;

        sheet.Cell(row, 1).Value = activity.Code;
        sheet.Cell(row, 2).Value = owner?.Code ?? activity.WbsCode;
        sheet.Cell(row, 3).Value = (owner?.Level ?? activity.WbsLevel) + 1;
        sheet.Cell(row, 4).Value = activity.IsMilestone ? "Milestone" : "Activity";
        sheet.Cell(row, 5).Value = activity.Name;
        sheet.Cell(row, 6).Value = activity.Budget;
        sheet.Cell(row, 7).Value = weightFactor;
        sheet.Cell(row, 8).Value = weightValue;
        sheet.Cell(row, 9).Value = activity.Progress / 100m;
        sheet.Cell(row, 10).Value = projectBudget == 0
            ? 0
            : activity.EarnedValue / projectBudget;
        sheet.Cell(row, 11).Value = activity.EarnedValue;
        sheet.Cell(row, 12).Value = activity.PlannedValue;
        sheet.Cell(row, 13).Value = activity.ActualCost;
        sheet.Cell(row, 14).Value = activity.CPI;
        sheet.Cell(row, 15).Value = activity.SPI;

        var range = sheet.Range(row, 1, row, 15);
        range.Style.Fill.BackgroundColor = XLColor.White;
        range.Style.Font.FontColor = XLColor.FromHtml(theme.Dark);
        range.Style.Font.FontSize = 9;
        sheet.Cell(row, 5).Style.Alignment.Indent =
            Math.Clamp((owner?.Level ?? activity.WbsLevel) + 1, 0, 15);
    }

    private static void WriteSectionRow(
        IXLWorksheet sheet,
        int row,
        string title,
        ThemePalette theme)
    {
        sheet.Range(row, 1, row, 15).Merge();
        var cell = sheet.Cell(row, 1);
        cell.Value = title;
        cell.Style.Font.Bold = true;
        cell.Style.Font.FontColor = XLColor.White;
        cell.Style.Fill.BackgroundColor = XLColor.FromHtml(theme.Dark);
    }

    private static void ApplyFormatting(
        IXLWorksheet sheet,
        int lastRow,
        ThemePalette theme)
    {
        if (lastRow >= FirstDataRow)
        {
            var dataRange = sheet.Range(FirstDataRow, 1, lastRow, 15);
            dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Hair;
            dataRange.Style.Border.InsideBorderColor = XLColor.FromHtml("#CBD5E1");
            dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            dataRange.Style.Border.OutsideBorderColor = XLColor.FromHtml(theme.Border);
            sheet.Range(HeaderRow, 1, lastRow, 15).SetAutoFilter();
        }

        sheet.Columns(6, 6).Style.NumberFormat.Format = "#,##0.00";
        sheet.Columns(7, 10).Style.NumberFormat.Format = "0.00%";
        sheet.Columns(11, 13).Style.NumberFormat.Format = "#,##0.00";
        sheet.Columns(14, 15).Style.NumberFormat.Format = "0.00";

        sheet.Column(1).Width = 16;
        sheet.Column(2).Width = 16;
        sheet.Column(3).Width = 8;
        sheet.Column(4).Width = 13;
        sheet.Column(5).Width = 38;
        sheet.Columns(6, 15).AdjustToContents();

        sheet.SheetView.FreezeRows(HeaderRow);
        sheet.PageSetup.PageOrientation = XLPageOrientation.Landscape;
        sheet.PageSetup.PaperSize = XLPaperSize.A4Paper;
        sheet.PageSetup.FitToPages(1, 0);
        sheet.PageSetup.Margins.Top = 0.35;
        sheet.PageSetup.Margins.Bottom = 0.45;
        sheet.PageSetup.Margins.Left = 0.25;
        sheet.PageSetup.Margins.Right = 0.25;
        sheet.PageSetup.Footer.Center.AddText("PCS Project Control Suite");
        sheet.PageSetup.Footer.Right.AddText("Page &P / &N");
        sheet.TabColor = XLColor.FromHtml(theme.Primary);
    }

    private static IEnumerable<WbsNodeDto> GetAllNodes(WbsNodeDto node)
    {
        yield return node;
        foreach (var child in node.Children)
        {
            foreach (var descendant in GetAllNodes(child))
                yield return descendant;
        }
    }

    private static string? ResolveBrandingPath(string? configuredPath)
    {
        var candidates = new List<string>();
        if (!string.IsNullOrWhiteSpace(configuredPath))
        {
            candidates.Add(Path.IsPathRooted(configuredPath)
                ? configuredPath
                : Path.Combine(AppContext.BaseDirectory, "Resources", "Branding", configuredPath));
        }

        candidates.Add(Path.Combine(
            AppContext.BaseDirectory, "Resources", "Branding", "pcs-logo.png"));

        return candidates.FirstOrDefault(File.Exists);
    }
}
