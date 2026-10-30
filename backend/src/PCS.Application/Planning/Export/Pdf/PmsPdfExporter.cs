using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Export.Pdf;

public sealed class PmsPdfExporter
{
    private static readonly string[] Headers =
    {
        "Code", "WBS / Activity", "Type", "Budget", "Progress",
        "Plan Start", "Plan Finish", "Actual Start", "Actual Finish",
        "Duration", "Remaining", "Status", "EV", "PV", "AC"
    };

    public Task<byte[]> GenerateAsync(ExportPmsDto dto)
    {
        using var document = new PdfDocument();
        document.Info.Title = $"PCS PMS - {dto.ProjectName}";
        document.Info.Author = dto.PlatformName;

        var themeDark = ParseColor(dto.ThemeDarkColor, XColor.FromArgb(15, 23, 42));
        var themePrimary = ParseColor(dto.ThemePrimaryColor, XColor.FromArgb(37, 99, 235));
        var nodes = Flatten(dto.WbsNodes ?? new());
        var byCode = nodes.Where(x => !string.IsNullOrWhiteSpace(x.Code))
            .GroupBy(x => x.Code.Trim(), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(x => x.Key, x => x.First(), StringComparer.OrdinalIgnoreCase);
        var activities = dto.Activities ?? new();
        var rows = new List<(string Code,string Name,string Type,decimal Budget,decimal Progress,DateTime? PS,DateTime? PF,DateTime? AS,DateTime? AF,int Duration,int Remaining,string Status,decimal EV,decimal PV,decimal AC,int Level,bool IsWbs)>();

        foreach (var node in nodes.OrderBy(x => x.Path, StringComparer.OrdinalIgnoreCase).ThenBy(x => x.SortOrder))
        {
            rows.Add((node.Code,node.Name,"WBS",node.Budget,node.Progress,null,null,null,null,0,0,"",node.EarnedValue,node.PlannedValue,node.ActualCost,node.Level,true));
            foreach (var activity in activities.Where(a => string.Equals(a.WbsCode?.Trim(),node.Code?.Trim(),StringComparison.OrdinalIgnoreCase)).OrderBy(a=>a.Code,StringComparer.OrdinalIgnoreCase))
                rows.Add((activity.Code,activity.Name,"Activity",activity.Budget,activity.Progress,activity.PlannedStart,activity.PlannedFinish,activity.ActualStart,activity.ActualFinish,activity.Duration,activity.RemainingDuration,activity.Status,activity.EarnedValue,activity.PlannedValue,activity.ActualCost,node.Level+1,false));
        }
        foreach (var activity in activities.Where(a => string.IsNullOrWhiteSpace(a.WbsCode) || !byCode.ContainsKey(a.WbsCode.Trim())).OrderBy(a=>a.Code,StringComparer.OrdinalIgnoreCase))
            rows.Add((activity.Code,activity.Name,"UNASSIGNED",activity.Budget,activity.Progress,activity.PlannedStart,activity.PlannedFinish,activity.ActualStart,activity.ActualFinish,activity.Duration,activity.RemainingDuration,activity.Status,activity.EarnedValue,activity.PlannedValue,activity.ActualCost,0,false));

        const double left = 24, right = 24, top = 24, rowHeight = 25;
        var widths = new[] { 58d, 210d, 62d, 66d, 54d, 66d, 66d, 66d, 66d, 48d, 48d, 65d, 66d, 66d, 66d };
        var pageIndex = 0;
        XGraphics? gfx = null;
        XFont titleFont = new("Arial", 15, XFontStyleEx.Bold);
        XFont smallFont = new("Arial", 7);
        XFont headerFont = new("Arial", 7, XFontStyleEx.Bold);
        XFont bodyFont = new("Arial", 7);
        double y = 0;

        void NewPage()
        {
            var page = document.AddPage();
            page.Size = PdfSharp.PageSize.A3;
            page.Orientation = PdfSharp.PageOrientation.Landscape;
            gfx = XGraphics.FromPdfPage(page);
            pageIndex++;
            y = top;
            gfx.DrawRectangle(new XSolidBrush(themeDark), left, y, page.Width.Point-left-right, 48);
            gfx.DrawString(dto.PlatformName ?? "PCS", titleFont, XBrushes.White, new XRect(left+12,y+6, page.Width.Point-left-right-24,20), XStringFormats.TopLeft);
            gfx.DrawString($"PROJECT MANAGEMENT SYSTEM  |  {dto.ProjectName}", new XFont("Arial",10,XFontStyleEx.Bold), XBrushes.White, new XRect(left+12,y+27,page.Width.Point-left-right-24,15), XStringFormats.TopLeft);
            y += 54;
            gfx.DrawString($"Client: {dto.ClientName}     Contractor: {dto.ContractorName}     Consultant: {dto.ConsultantName}", smallFont, XBrushes.Black, left, y);
            gfx.DrawString($"Report: {dto.ReportTitle}     Exported: {dto.ExportDate:yyyy-MM-dd HH:mm} UTC", smallFont, XBrushes.Black, left+560, y);
            y += 18;
            var x = left;
            for (var i=0;i<Headers.Length;i++)
            {
                gfx.DrawRectangle(new XSolidBrush(themePrimary), x, y, widths[i], rowHeight);
                gfx.DrawString(Headers[i], headerFont, XBrushes.White, new XRect(x+3,y+7,widths[i]-6,rowHeight-8), XStringFormats.TopLeft);
                x += widths[i];
            }
            y += rowHeight;
        }

        NewPage();
        foreach (var item in rows)
        {
            if (y + rowHeight > document.Pages[pageIndex-1].Height.Point - 32)
            {
                gfx!.DrawString($"PCS | Page {pageIndex}", smallFont, XBrushes.Gray, left, document.Pages[pageIndex-1].Height.Point-18);
                NewPage();
            }
            var x = left;
            var values = new[]
            {
                item.Code, item.Name, item.Type, item.Budget.ToString("#,##0.##"),
                item.Progress.ToString("0.0")+"%",
                Date(item.PS),Date(item.PF),Date(item.AS),Date(item.AF),
                item.Duration.ToString(),item.Remaining.ToString(),item.Status,
                item.EV.ToString("#,##0.##"),item.PV.ToString("#,##0.##"),item.AC.ToString("#,##0.##")
            };
            var fill = item.IsWbs ? (item.Level <= 1 ? themeDark : themePrimary) : XColors.White;
            var text = item.IsWbs && item.Level <= 1 ? XBrushes.White : XBrushes.Black;
            for (var i=0;i<values.Length;i++)
            {
                gfx!.DrawRectangle(new XSolidBrush(item.IsWbs ? fill : XColors.White), x, y, widths[i], rowHeight);
                gfx.DrawRectangle(new XPen(XColor.FromArgb(210,220,232),0.35),x,y,widths[i],rowHeight);
                var font = item.IsWbs ? headerFont : bodyFont;
                gfx.DrawString(Trim(values[i], i==1 ? 37 : 14), font, text, new XRect(x+3,y+7,widths[i]-6,rowHeight-8), XStringFormats.TopLeft);
                x += widths[i];
            }
            y += rowHeight;
        }
        gfx!.DrawString($"PCS | Page {pageIndex}", smallFont, XBrushes.Gray, left, document.Pages[pageIndex-1].Height.Point-18);

        using var stream = new MemoryStream();
        document.Save(stream, false);
        return Task.FromResult(stream.ToArray());
    }

    private static string Date(DateTime? value) => value?.ToString("yyyy-MM-dd") ?? "—";
    private static string Trim(string value, int length) => string.IsNullOrEmpty(value) || value.Length <= length ? value : value[..(length-1)]+"…";
    private static XColor ParseColor(string? value, XColor fallback)
    {
        try { return string.IsNullOrWhiteSpace(value) ? fallback : XColor.FromArgb(Convert.ToInt32(value.TrimStart('#'),16) | unchecked((int)0xFF000000)); }
        catch { return fallback; }
    }
    private static List<WbsNodeDto> Flatten(List<WbsNodeDto> source)
    {
        var result = new List<WbsNodeDto>();
        var visited = new HashSet<Guid>();
        void Visit(WbsNodeDto node)
        {
            if (node.Id != Guid.Empty && !visited.Add(node.Id)) return;
            result.Add(node);
            foreach (var child in node.Children ?? new()) Visit(child);
        }
        foreach (var node in source) Visit(node);
        return result;
    }
}