using System.Globalization;

using PCS.Application.Planning.DTOs;

using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PCS.Application.Planning.Export.Pdf;

/// <summary>
/// Creates a branded, multi-page PMS register in A3 landscape format.
/// The WBS hierarchy and its assigned activities are rendered in one
/// register, with repeated table headings and page numbering.
/// </summary>
public sealed class PmsPdfExporter : IPmsPdfExporter
{
    private const int TableColumnCount = 15;

    private static readonly string[] TableHeaders =
    [
        "کد",
        "والد",
        "سطح",
        "نوع",
        "شرح فعالیت / بسته کاری",
        "بودجه",
        "W.F %",
        "W.V %",
        "پیشرفت %",
        "پیشرفت وزنی %",
        "EV",
        "PV",
        "AC",
        "CPI",
        "SPI"
    ];

    private readonly PdfBrandingService _brandingService;

    public PmsPdfExporter(PdfBrandingService brandingService)
    {
        _brandingService = brandingService;
    }

    public byte[] Generate(ExportPmsDto dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        var rows = BuildRows(dto);
        var platformLogo = _brandingService.GetPlatformLogo(dto);
        var companyLogo = _brandingService.GetCompanyLogo(dto);

        return Document.Create(document =>
        {
            document.Page(page =>
            {
                page.Size(PageSizes.A3.Landscape());
                page.MarginHorizontal(22);
                page.MarginVertical(18);
                page.PageColor(Colors.White);

                page.DefaultTextStyle(style => style
                    .FontFamily("Segoe UI", "Noto Sans Arabic", "Arial", "Lato")
                    .FontSize(7)
                    .FontColor(Colors.Grey.Darken4));

                page.Header()
                    .Height(58)
                    .Element(container => ComposeHeader(
                        container,
                        dto,
                        platformLogo,
                        companyLogo));

                page.Content()
                    .PaddingTop(8)
                    .Element(container => ComposeBody(container, dto, rows));

                page.Footer()
                    .PaddingTop(7)
                    .Element(ComposeFooter);
            });
        }).GeneratePdf();
    }

    private static void ComposeHeader(
        IContainer container,
        ExportPmsDto dto,
        byte[]? platformLogo,
        byte[]? companyLogo)
    {
        container
            .ContentFromRightToLeft()
            .BorderBottom(2)
            .BorderColor(Colors.Blue.Darken2)
            .PaddingBottom(7)
            .Row(row =>
            {
                if (platformLogo is not null)
                {
                    row.ConstantItem(76)
                        .Height(43)
                        .Image(platformLogo)
                        .FitArea();
                }

                row.RelativeItem()
                    .PaddingHorizontal(10)
                    .AlignMiddle()
                    .Column(column =>
                    {
                        column.Item()
                            .Text("PCS | PROJECT CONTROL SUITE")
                            .FontSize(9)
                            .Bold()
                            .FontColor(Colors.Blue.Darken2);

                        column.Item()
                            .PaddingTop(2)
                            .Text(string.IsNullOrWhiteSpace(dto.ReportTitle)
                                ? "گزارش جامع سیستم مدیریت پروژه"
                                : dto.ReportTitle)
                            .FontSize(13)
                            .Bold()
                            .FontColor(Colors.Blue.Darken4);

                        var companyName = string.IsNullOrWhiteSpace(dto.CompanyDisplayName)
                            ? dto.ClientName
                            : dto.CompanyDisplayName;

                        if (!string.IsNullOrWhiteSpace(companyName))
                        {
                            column.Item()
                                .PaddingTop(2)
                                .Text(companyName)
                                .FontSize(8)
                                .FontColor(Colors.Grey.Darken2);
                        }
                    });

                if (companyLogo is not null)
                {
                    row.ConstantItem(76)
                        .Height(43)
                        .Image(companyLogo)
                        .FitArea();
                }
            });
    }

    private static void ComposeBody(
        IContainer container,
        ExportPmsDto dto,
        IReadOnlyCollection<PmsPdfRow> rows)
    {
        container
            .ContentFromRightToLeft()
            .Column(column =>
            {
                column.Spacing(9);

                column.Item().Row(row =>
                {
                    row.RelativeItem()
                        .Text($"پروژه: {Display(dto.ProjectName)}")
                        .FontSize(9)
                        .Bold();

                    row.RelativeItem()
                        .AlignLeft()
                        .Text($"تاریخ تهیه: {dto.ExportDate.ToLocalTime():yyyy/MM/dd HH:mm}")
                        .FontSize(8)
                        .FontColor(Colors.Grey.Darken2);
                });

                column.Item().Row(row =>
                {
                    row.Spacing(6);

                    row.RelativeItem().Element(c => ComposeKpi(
                        c, "پیشرفت کل", FormatPercent(dto.OverallProgress)));

                    row.RelativeItem().Element(c => ComposeKpi(
                        c, "بودجه کل", FormatAmount(dto.TotalBudget)));

                    row.RelativeItem().Element(c => ComposeKpi(
                        c, "تعداد فعالیت‌ها", dto.TotalActivities.ToString(CultureInfo.InvariantCulture)));

                    row.RelativeItem().Element(c => ComposeKpi(
                        c, "تعداد گره‌های WBS", dto.TotalWbsNodes.ToString(CultureInfo.InvariantCulture)));

                    row.RelativeItem().Element(c => ComposeKpi(
                        c, "CPI", FormatIndex(dto.CPI)));

                    row.RelativeItem().Element(c => ComposeKpi(
                        c, "SPI", FormatIndex(dto.SPI)));
                });

                column.Item()
                    .PaddingTop(2)
                    .Text("ساختار شکست کار و فهرست فعالیت‌ها")
                    .FontSize(10)
                    .Bold()
                    .FontColor(Colors.Blue.Darken4);

                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(1.15f); // Code
                        columns.RelativeColumn(1.05f); // Parent
                        columns.RelativeColumn(0.48f); // Level
                        columns.RelativeColumn(0.85f); // Type
                        columns.RelativeColumn(3.20f); // Description
                        columns.RelativeColumn(1.15f); // Budget
                        columns.RelativeColumn(0.68f); // WF
                        columns.RelativeColumn(0.68f); // WV
                        columns.RelativeColumn(0.78f); // Progress
                        columns.RelativeColumn(1.02f); // Weighted progress
                        columns.RelativeColumn(0.95f); // EV
                        columns.RelativeColumn(0.95f); // PV
                        columns.RelativeColumn(0.95f); // AC
                        columns.RelativeColumn(0.58f); // CPI
                        columns.RelativeColumn(0.58f); // SPI
                    });

                    table.Header(header =>
                    {
                        foreach (var title in TableHeaders)
                        {
                            header.Cell().Element(cell =>
                                ComposeHeaderCell(cell, title));
                        }
                    });

                    foreach (var item in rows)
                    {
                        if (item.IsSection)
                        {
                            table.Cell()
                                .ColumnSpan(TableColumnCount)
                                .Element(cell =>
                                    cell.Background(Colors.Blue.Darken3)
                                        .Padding(5)
                                        .Text(item.Name)
                                        .FontSize(8)
                                        .Bold()
                                        .FontColor(Colors.White));
                            continue;
                        }

                        var values = new[]
                        {
                            item.Code,
                            item.ParentCode,
                            item.Level.ToString(CultureInfo.InvariantCulture),
                            item.Type,
                            item.Name,
                            FormatAmount(item.Budget),
                            FormatPercent(item.WeightFactor),
                            FormatPercent(item.WeightValue),
                            FormatPercent(item.Progress),
                            FormatPercent(item.WeightedProgress),
                            FormatAmount(item.EarnedValue),
                            FormatAmount(item.PlannedValue),
                            FormatAmount(item.ActualCost),
                            FormatIndex(item.CPI),
                            FormatIndex(item.SPI)
                        };

                        for (var index = 0; index < values.Length; index++)
                        {
                            var cellIndex = index;
                            table.Cell().Element(cell =>
                                ComposeBodyCell(cell, values[cellIndex], item, cellIndex == 4));
                        }
                    }
                });

                column.Item()
                    .PaddingTop(2)
                    .Text("شاخص‌های ارزش کسب‌شده (EVM)")
                    .FontSize(9)
                    .Bold()
                    .FontColor(Colors.Blue.Darken4);

                column.Item().Row(row =>
                {
                    row.Spacing(8);
                    row.RelativeItem().Element(c => ComposeMetric(c, "PV - ارزش برنامه‌ای", dto.PlannedValue));
                    row.RelativeItem().Element(c => ComposeMetric(c, "EV - ارزش کسب‌شده", dto.EarnedValue));
                    row.RelativeItem().Element(c => ComposeMetric(c, "AC - هزینه واقعی", dto.ActualCost));
                    row.RelativeItem().Element(c => ComposeMetric(c, "CV - انحراف هزینه", dto.CostVariance));
                    row.RelativeItem().Element(c => ComposeMetric(c, "SV - انحراف زمان‌بندی", dto.ScheduleVariance));
                });
            });
    }

    private static void ComposeKpi(IContainer container, string label, string value)
    {
        container
            .Border(1)
            .BorderColor(Colors.Grey.Lighten2)
            .Background(Colors.Grey.Lighten5)
            .PaddingVertical(6)
            .PaddingHorizontal(7)
            .Column(column =>
            {
                column.Item()
                    .Text(label)
                    .FontSize(7)
                    .FontColor(Colors.Grey.Darken2);

                column.Item()
                    .PaddingTop(3)
                    .Text(value)
                    .FontSize(11)
                    .Bold()
                    .FontColor(Colors.Blue.Darken3);
            });
    }

    private static void ComposeMetric(IContainer container, string label, decimal value)
    {
        container
            .BorderBottom(1)
            .BorderColor(Colors.Grey.Lighten2)
            .PaddingVertical(5)
            .Column(column =>
            {
                column.Item()
                    .Text(label)
                    .FontSize(7)
                    .FontColor(Colors.Grey.Darken2);

                column.Item()
                    .PaddingTop(2)
                    .Text(FormatAmount(value))
                    .FontSize(8)
                    .Bold();
            });
    }

    private static void ComposeHeaderCell(IContainer container, string text)
    {
        container
            .Background(Colors.Blue.Darken3)
            .BorderBottom(1)
            .BorderColor(Colors.Blue.Darken4)
            .PaddingVertical(5)
            .PaddingHorizontal(2)
            .AlignCenter()
            .Text(text)
            .FontSize(6.5f)
            .Bold()
            .FontColor(Colors.White);
    }

    private static void ComposeBodyCell(
        IContainer container,
        string text,
        PmsPdfRow row,
        bool isDescription)
    {
        var background = row.IsWbs
            ? row.Level <= 1
                ? Colors.Blue.Darken2
                : row.Level == 2
                    ? Colors.Blue.Lighten4
                    : Colors.Grey.Lighten4
            : row.IsMilestone
                ? Colors.Yellow.Lighten4
                : Colors.White;

        var foreground = row.IsWbs && row.Level <= 1
            ? Colors.White
            : row.IsCritical
                ? Colors.Red.Darken2
                : Colors.Grey.Darken4;

        var cell = container
            .Background(background)
            .BorderBottom(0.5f)
            .BorderColor(Colors.Grey.Lighten2)
            .PaddingVertical(4)
            .PaddingHorizontal(2);

        if (isDescription)
        {
            cell.AlignRight()
                .Text(text)
                .FontSize(6.5f)
                .Bold(row.IsWbs || row.IsCritical)
                .FontColor(foreground);
        }
        else
        {
            cell.AlignCenter()
                .Text(text)
                .FontSize(6.2f)
                .Bold(row.IsWbs || row.IsCritical)
                .FontColor(foreground);
        }
    }

    private static void ComposeFooter(IContainer container)
    {
        container
            .BorderTop(1)
            .BorderColor(Colors.Grey.Lighten2)
            .PaddingTop(5)
            .Row(row =>
            {
                row.RelativeItem()
                    .Text("PCS Project Control Suite")
                    .FontSize(7)
                    .FontColor(Colors.Grey.Darken1);

                row.RelativeItem()
                    .AlignCenter()
                    .Text(text =>
                    {
                        text.Span("صفحه ");
                        text.CurrentPageNumber();
                        text.Span(" از ");
                        text.TotalPages();
                    })
                    .FontSize(7)
                    .FontColor(Colors.Grey.Darken1);

                row.RelativeItem()
                    .AlignLeft()
                    .Text("گزارش PMS")
                    .FontSize(7)
                    .FontColor(Colors.Grey.Darken1);
            });
    }

    private static List<PmsPdfRow> BuildRows(ExportPmsDto dto)
    {
        var result = new List<PmsPdfRow>();
        var activitiesByWbs = dto.Activities
            .Where(activity => !string.IsNullOrWhiteSpace(activity.WbsCode))
            .GroupBy(activity => activity.WbsCode, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.OrderBy(activity => activity.Code, StringComparer.OrdinalIgnoreCase).ToList(),
                StringComparer.OrdinalIgnoreCase);

        var knownWbsCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        void AddNode(WbsNodeDto node)
        {
            knownWbsCodes.Add(node.Code);

            result.Add(new PmsPdfRow
            {
                IsWbs = true,
                Level = node.Level,
                Code = node.Code,
                ParentCode = node.ParentCode ?? string.Empty,
                Type = "WBS",
                Name = node.Name,
                Budget = node.Budget,
                WeightFactor = node.WeightFactor,
                WeightValue = node.WeightValue,
                Progress = node.Progress,
                WeightedProgress = dto.TotalBudget == 0
                    ? 0
                    : node.EarnedValue / dto.TotalBudget * 100m,
                EarnedValue = node.EarnedValue,
                PlannedValue = node.PlannedValue,
                ActualCost = node.ActualCost,
                CPI = node.CPI,
                SPI = node.SPI
            });

            if (activitiesByWbs.TryGetValue(node.Code, out var assignedActivities))
            {
                foreach (var activity in assignedActivities)
                    AddActivity(activity, node.Code, node.Level + 1);
            }

            foreach (var child in node.Children
                         .OrderBy(child => child.SortOrder)
                         .ThenBy(child => child.Code, StringComparer.OrdinalIgnoreCase))
            {
                AddNode(child);
            }
        }

        foreach (var root in dto.WbsNodes
                     .OrderBy(node => node.SortOrder)
                     .ThenBy(node => node.Code, StringComparer.OrdinalIgnoreCase))
        {
            AddNode(root);
        }

        var unassigned = dto.Activities
            .Where(activity => string.IsNullOrWhiteSpace(activity.WbsCode) ||
                               !knownWbsCodes.Contains(activity.WbsCode))
            .OrderBy(activity => activity.Code, StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (unassigned.Count > 0)
        {
            result.Add(new PmsPdfRow
            {
                IsSection = true,
                Name = "فعالیت‌های بدون انتساب به WBS"
            });

            foreach (var activity in unassigned)
                AddActivity(activity, activity.WbsCode, Math.Max(1, activity.WbsLevel + 1));
        }

        return result;

        void AddActivity(ActivityDto activity, string parentCode, int level)
        {
            result.Add(new PmsPdfRow
            {
                IsMilestone = activity.IsMilestone,
                IsCritical = activity.IsCritical,
                Level = level,
                Code = activity.Code,
                ParentCode = parentCode,
                Type = activity.IsMilestone ? "Milestone" : "Activity",
                Name = activity.Name,
                Budget = activity.Budget,
                WeightFactor = activity.WeightFactor,
                WeightValue = activity.WeightValue,
                Progress = activity.Progress,
                WeightedProgress = dto.TotalBudget == 0
                    ? 0
                    : activity.EarnedValue / dto.TotalBudget * 100m,
                EarnedValue = activity.EarnedValue,
                PlannedValue = activity.PlannedValue,
                ActualCost = activity.ActualCost,
                CPI = activity.CPI,
                SPI = activity.SPI
            });
        }
    }

    private static string FormatAmount(decimal value) =>
        value.ToString("#,##0.##", CultureInfo.InvariantCulture);

    private static string FormatPercent(decimal value) =>
        $"{value.ToString("0.0", CultureInfo.InvariantCulture)}%";

    private static string FormatIndex(decimal value) =>
        value.ToString("0.00", CultureInfo.InvariantCulture);

    private static string Display(string? value) =>
        string.IsNullOrWhiteSpace(value) ? "—" : value;

    private sealed class PmsPdfRow
    {
        public bool IsSection { get; init; }
        public bool IsWbs { get; init; }
        public bool IsMilestone { get; init; }
        public bool IsCritical { get; init; }
        public int Level { get; init; }
        public string Code { get; init; } = string.Empty;
        public string ParentCode { get; init; } = string.Empty;
        public string Type { get; init; } = string.Empty;
        public string Name { get; init; } = string.Empty;
        public decimal Budget { get; init; }
        public decimal WeightFactor { get; init; }
        public decimal WeightValue { get; init; }
        public decimal Progress { get; init; }
        public decimal WeightedProgress { get; init; }
        public decimal EarnedValue { get; init; }
        public decimal PlannedValue { get; init; }
        public decimal ActualCost { get; init; }
        public decimal CPI { get; init; }
        public decimal SPI { get; init; }
    }
}
