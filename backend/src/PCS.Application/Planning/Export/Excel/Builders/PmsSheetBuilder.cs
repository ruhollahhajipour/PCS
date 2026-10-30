using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class PmsSheetBuilder
{
    private const int HeaderRow = 7;
    private const int FirstDataRow = 8;
    private const int Columns = 21;

    private sealed record PmsRow(int Number, WbsNodeDto? Wbs, ActivityDto? Activity, int Depth);

    public void Build(XLWorkbook workbook, ExportPmsDto dto)
    {
        var sheet = workbook.Worksheets.Add("PMS");
        sheet.ShowGridLines = false;
        var theme = ThemePalette.Create(dto.ThemePrimaryColor, dto.ThemeDarkColor, dto.ThemeSecondaryColor, dto.ThemeBorderColor);
        sheet.PageSetup.PageOrientation = XLPageOrientation.Landscape;
        sheet.PageSetup.PaperSize = XLPaperSize.A3Paper;
        sheet.PageSetup.PagesWide = 1;
        sheet.PageSetup.PagesTall = 0;
        sheet.PageSetup.Margins.Top = 0.35;
        sheet.PageSetup.Margins.Bottom = 0.35;
        sheet.PageSetup.Margins.Left = 0.25;
        sheet.PageSetup.Margins.Right = 0.25;
        sheet.PageSetup.CenterHorizontally = true;
        sheet.PageSetup.SetRowsToRepeatAtTop("1:7");
        sheet.PageSetup.Header.Center.AddText("PCS | PROJECT MANAGEMENT SYSTEM");
        sheet.PageSetup.Footer.Left.AddText("Controlled project schedule");
        sheet.PageSetup.Footer.Right.AddText("Page &P of &N");

        sheet.Range("A1:U2").Merge();
        var title = sheet.Cell("A1");
        title.Value = $"{dto.PlatformName}  |  {dto.ProjectName}\nPROJECT MANAGEMENT SYSTEM";
        title.Style.Font.Bold = true;
        title.Style.Font.FontSize = 17;
        title.Style.Font.FontColor = XLColor.White;
        title.Style.Fill.BackgroundColor = XLColor.FromHtml(theme.Dark);
        title.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        title.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        title.Style.Alignment.WrapText = true;
        sheet.Row(1).Height = 28;
        sheet.Row(2).Height = 22;
        var logo = Path.Combine(AppContext.BaseDirectory, "Resources", "Branding",
            string.IsNullOrWhiteSpace(dto.PlatformLogoPath) ? "pcs-logo.png" : dto.PlatformLogoPath);
        if (File.Exists(logo))
        {
            try { sheet.AddPicture(logo).MoveTo(sheet.Cell("A1")).WithSize(78, 42); }
            catch (Exception) { /* Optional branding asset. */ }
        }
        sheet.Range("A3:U3").Merge();
        sheet.Cell("A3").Value = $"Client: {dto.ClientName}   |   Contractor: {dto.ContractorName}   |   Consultant: {dto.ConsultantName}";
        sheet.Cell("A3").Style.Font.Bold = true;
        sheet.Cell("A3").Style.Fill.BackgroundColor = XLColor.FromHtml("#EAF1FF");
        sheet.Range("A4:U4").Merge();
        sheet.Cell("A4").Value = $"{dto.ReportTitle}   |   Exported: {dto.ExportDate:yyyy-MM-dd HH:mm} UTC";
        sheet.Range("A5:U5").Merge();
        sheet.Cell("A5").Value = "WBS SUMMARY & ACTIVITY REGISTER — hierarchical roll-up of assigned project activities.";
        sheet.Cell("A5").Style.Font.Italic = true;

        string[] headers = { "Code", "Parent WBS", "Level", "Type", "WBS / Activity Description", "Budget", "W.F %", "W.V %", "Progress %", "Weighted Progress %", "Planned Start", "Planned Finish", "Actual Start", "Actual Finish", "Duration", "Remaining", "Status", "Milestone", "EV", "PV", "AC" };
        for (var c = 0; c < headers.Length; c++) sheet.Cell(HeaderRow, c + 1).Value = headers[c];
        var header = sheet.Range(HeaderRow, 1, HeaderRow, Columns);
        header.Style.Font.Bold = true;
        header.Style.Font.FontColor = XLColor.White;
        header.Style.Fill.BackgroundColor = XLColor.FromHtml(theme.Primary);
        header.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        header.Style.Alignment.WrapText = true;
        sheet.Row(HeaderRow).Height = 32;

        var nodes = Flatten(dto.WbsNodes ?? new());
        var byId = nodes.Where(x => x.Id != Guid.Empty).GroupBy(x => x.Id).ToDictionary(g => g.Key, g => g.First());
        var byCode = nodes.Where(x => !string.IsNullOrWhiteSpace(x.Code)).GroupBy(x => x.Code.Trim(), StringComparer.OrdinalIgnoreCase).ToDictionary(g => g.Key, g => g.First(), StringComparer.OrdinalIgnoreCase);
        var children = nodes.ToDictionary(x => x.Id, _ => new List<WbsNodeDto>());
        var roots = new List<WbsNodeDto>();
        foreach (var n in nodes)
        {
            WbsNodeDto? parent = n.ParentId.HasValue && byId.TryGetValue(n.ParentId.Value, out var p) ? p :
                (!string.IsNullOrWhiteSpace(n.ParentCode) && byCode.TryGetValue(n.ParentCode.Trim(), out var pc) ? pc : null);
            if (parent != null && parent.Id != n.Id) children[parent.Id].Add(n);
            else if (parent == null) roots.Add(n);
        }
        foreach (var group in children.Values) group.Sort(Compare);
        roots.Sort(Compare);

        var assigned = new Dictionary<Guid, List<ActivityDto>>();
        var unassigned = new List<ActivityDto>();
        foreach (var a in dto.Activities ?? new())
        {
            if (!string.IsNullOrWhiteSpace(a.WbsCode) && byCode.TryGetValue(a.WbsCode.Trim(), out var target))
            {
                if (!assigned.TryGetValue(target.Id, out var list)) assigned[target.Id] = list = new();
                list.Add(a);
            }
            else unassigned.Add(a);
        }
        foreach (var list in assigned.Values) list.Sort((a,b) => StringComparer.OrdinalIgnoreCase.Compare(a.Code,b.Code));

        var rows = new List<PmsRow>();
        var wbsRow = new Dictionary<Guid,int>();
        var rowNumber = FirstDataRow;
        void AddWbs(WbsNodeDto n, int depth)
        {
            wbsRow[n.Id] = rowNumber;
            rows.Add(new PmsRow(rowNumber++, n, null, depth));
            foreach (var child in children[n.Id]) AddWbs(child, depth + 1);
            if (assigned.TryGetValue(n.Id, out var acts))
                foreach (var a in acts) rows.Add(new PmsRow(rowNumber++, null, a, depth + 1));
        }
        foreach (var root in roots) AddWbs(root, Math.Max(0, root.Level - 1));

        if (unassigned.Count > 0)
        {
            sheet.Range(rowNumber,1,rowNumber,Columns).Merge();
            sheet.Cell(rowNumber,1).Value = "UNASSIGNED ACTIVITIES — WBS CODE NOT FOUND";
            sheet.Cell(rowNumber,1).Style.Font.Bold = true;
            sheet.Cell(rowNumber,1).Style.Font.FontColor = XLColor.White;
            sheet.Cell(rowNumber,1).Style.Fill.BackgroundColor = XLColor.FromHtml(theme.Dark);
            rowNumber++;
            foreach (var a in unassigned.OrderBy(x => x.Code, StringComparer.OrdinalIgnoreCase))
                rows.Add(new PmsRow(rowNumber++, null, a, 0));
        }

        var maxDepth = nodes.Select(x => Math.Max(1, x.Level)).DefaultIfEmpty(1).Max();
        foreach (var item in rows)
        {
            var r = item.Number;
            if (item.Wbs is { } n)
            {
                sheet.Cell(r,1).Value = n.Code;
                sheet.Cell(r,2).Value = n.ParentCode ?? "";
                sheet.Cell(r,3).Value = n.Level;
                sheet.Cell(r,4).Value = "WBS";
                sheet.Cell(r,5).Value = n.Name;
                sheet.Cell(r,6).Value = n.Budget;
                sheet.Cell(r,9).Value = n.Progress / 100m;
                sheet.Cell(r,19).Value = n.EarnedValue;
                sheet.Cell(r,20).Value = n.PlannedValue;
                sheet.Cell(r,21).Value = n.ActualCost;
                var fill = theme.GetWbsLevelColor(Math.Max(1,n.Level), maxDepth);
                var range = sheet.Range(r,1,r,Columns);
                range.Style.Fill.BackgroundColor = XLColor.FromHtml(fill);
                range.Style.Font.Bold = true;
                range.Style.Font.FontColor = n.Level <= 1 ? XLColor.White : XLColor.FromHtml(theme.Dark);
                sheet.Cell(r,5).Style.Alignment.Indent = Math.Min(15,Math.Max(0,n.Level));
            }
            else if (item.Activity is { } a)
            {
                sheet.Cell(r,1).Value = a.Code;
                sheet.Cell(r,2).Value = a.WbsCode;
                sheet.Cell(r,3).Value = item.Depth;
                sheet.Cell(r,4).Value = "Activity";
                sheet.Cell(r,5).Value = a.Name;
                sheet.Cell(r,6).Value = a.Budget;
                sheet.Cell(r,9).Value = a.Progress / 100m;
                if (a.PlannedStart.HasValue) sheet.Cell(r,11).Value = a.PlannedStart.Value;
                if (a.PlannedFinish.HasValue) sheet.Cell(r,12).Value = a.PlannedFinish.Value;
                if (a.ActualStart.HasValue) sheet.Cell(r,13).Value = a.ActualStart.Value;
                if (a.ActualFinish.HasValue) sheet.Cell(r,14).Value = a.ActualFinish.Value;
                sheet.Cell(r,15).Value = a.Duration;
                sheet.Cell(r,16).Value = a.RemainingDuration;
                sheet.Cell(r,17).Value = a.Status;
                sheet.Cell(r,18).Value = a.IsMilestone ? "Yes" : "No";
                sheet.Cell(r,19).Value = a.EarnedValue;
                sheet.Cell(r,20).Value = a.PlannedValue;
                sheet.Cell(r,21).Value = a.ActualCost;
                sheet.Cell(r,5).Style.Alignment.Indent = Math.Min(15,Math.Max(0,item.Depth));
                // Activity rows deliberately remain unfilled.
            }
        }

        // Roll up only direct children. Summing descendant ranges would double count nested WBS.
        foreach (var n in nodes.OrderByDescending(x => x.Level))
        {
            if (!wbsRow.TryGetValue(n.Id, out var parentRow)) continue;
            var directRows = new List<int>();
            directRows.AddRange(children[n.Id].Where(x => wbsRow.ContainsKey(x.Id)).Select(x => wbsRow[x.Id]));
            if (assigned.TryGetValue(n.Id, out var acts))
            {
                var codes = new HashSet<string>(acts.Select(x => x.Code), StringComparer.OrdinalIgnoreCase);
                directRows.AddRange(rows.Where(x => x.Activity != null && codes.Contains(x.Activity.Code)).Select(x => x.Number));
            }
            if (directRows.Count == 0) continue;
            string Sum(int col) => "SUM(" + string.Join(",", directRows.Select(x => $"{(char)('A' + col - 1)}{x}")) + ")";
            sheet.Cell(parentRow,6).FormulaA1 = "=" + Sum(6);
            sheet.Cell(parentRow,19).FormulaA1 = "=" + Sum(19);
            sheet.Cell(parentRow,20).FormulaA1 = "=" + Sum(20);
            sheet.Cell(parentRow,21).FormulaA1 = "=" + Sum(21);
            sheet.Cell(parentRow,9).FormulaA1 = $"=IF(F{parentRow}=0,0,S{parentRow}/F{parentRow})";
            sheet.Cell(parentRow,10).FormulaA1 = $"=IF(F{parentRow}=0,0,S{parentRow}/F{parentRow})";
        }

        foreach (var item in rows.Where(x => x.Wbs != null))
        {
            var r = item.Number;
            var p = item.Wbs!.ParentId.HasValue && wbsRow.TryGetValue(item.Wbs.ParentId.Value, out var parent) ? parent :
                (!string.IsNullOrWhiteSpace(item.Wbs.ParentCode) ? rows.FirstOrDefault(x => x.Wbs?.Code == item.Wbs.ParentCode)?.Number ?? FirstDataRow : FirstDataRow);
            sheet.Cell(r,7).FormulaA1 = $"=IFERROR(F{r}/F{p},0)";
            sheet.Cell(r,8).FormulaA1 = $"=IFERROR(F{r}/F{FirstDataRow},0)";
        }
        foreach (var item in rows.Where(x => x.Activity != null))
        {
            var r = item.Number;
            sheet.Cell(r,7).FormulaA1 = $"=IFERROR(F{r}/SUMIF(B:B,B{r},F:F),0)";
            sheet.Cell(r,8).FormulaA1 = $"=IFERROR(F{r}/F{FirstDataRow},0)";
            sheet.Cell(r,10).FormulaA1 = $"=I{r}*H{r}";
        }

        sheet.Cell("A6").Value = "WBS Nodes";
        sheet.Cell("B6").Value = dto.TotalWbsNodes > 0 ? dto.TotalWbsNodes : nodes.Count;
        sheet.Cell("D6").Value = "Activities";
        sheet.Cell("E6").Value = dto.TotalActivities > 0 ? dto.TotalActivities : (dto.Activities?.Count ?? 0);
        sheet.Cell("G6").Value = "Budget";
        sheet.Cell("H6").Value = dto.TotalBudget;
        sheet.Cell("J6").Value = "Overall Progress";
        sheet.Cell("K6").Value = dto.OverallProgress / 100m;
        sheet.Cell("K6").Style.NumberFormat.Format = "0.00%";
        sheet.Cell("M6").Value = "EV";
        sheet.Cell("N6").Value = dto.EarnedValue;
        sheet.Cell("P6").Value = "PV";
        sheet.Cell("Q6").Value = dto.PlannedValue;
        sheet.Cell("S6").Value = "AC";
        sheet.Cell("T6").Value = dto.ActualCost;
        sheet.Range("A6:T6").Style.Font.Bold = true;
        sheet.Range("A6:T6").Style.Fill.BackgroundColor = XLColor.FromHtml("#EAF1FF");

        var last = Math.Max(HeaderRow,rowNumber - 1);
        var used = sheet.Range(HeaderRow,1,last,Columns);
        used.Style.Border.InsideBorder = XLBorderStyleValues.Hair;
        used.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        sheet.Columns(6,6).Style.NumberFormat.Format = "#,##0.00";
        sheet.Columns(7,10).Style.NumberFormat.Format = "0.00%";
        sheet.Columns(11,14).Style.DateFormat.Format = "yyyy-mm-dd";
        sheet.Columns(15,16).Style.NumberFormat.Format = "0";
        sheet.Columns(19,21).Style.NumberFormat.Format = "#,##0.00";
        sheet.Range($"A{HeaderRow}:U{last}").SetAutoFilter();
        sheet.SheetView.FreezeRows(HeaderRow);
        sheet.Column(1).Width = 15; sheet.Column(2).Width = 15; sheet.Column(3).Width = 7; sheet.Column(4).Width = 12;
        sheet.Column(5).Width = 42; sheet.Columns(6,10).Width = 13; sheet.Columns(11,14).Width = 13;
        sheet.Columns(15,16).Width = 10; sheet.Column(17).Width = 15; sheet.Column(18).Width = 10; sheet.Columns(19,21).Width = 14;
        sheet.TabColor = XLColor.FromHtml(theme.Primary);
    }

    private static List<WbsNodeDto> Flatten(List<WbsNodeDto> roots)
    {
        var result = new List<WbsNodeDto>();
        var visited = new HashSet<Guid>();
        void Visit(WbsNodeDto n)
        {
            if (n.Id != Guid.Empty && !visited.Add(n.Id)) return;
            result.Add(n);
            foreach (var child in n.Children ?? new List<WbsNodeDto>()) Visit(child);
        }
        foreach (var root in roots) Visit(root);
        return result;
    }

    private static int Compare(WbsNodeDto a, WbsNodeDto b)
    {
        var order = a.SortOrder.CompareTo(b.SortOrder);
        return order != 0 ? order : StringComparer.OrdinalIgnoreCase.Compare(a.Code,b.Code);
    }
}