using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;

namespace PCS.Application.Planning.Services;

public sealed class PmsExcelService : IPmsExcelService
{
    private readonly IPcsProfessionalPmsExporter _exporter;

    public PmsExcelService(IPcsProfessionalPmsExporter exporter) => _exporter = exporter;

    public Task<byte[]> GeneratePmsExcelAsync(ExportPmsDto dto) => _exporter.GenerateAsync(dto);

    public Task<ImportPmsDto> ReadPmsExcelAsync(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            throw new ArgumentException("Excel file path is required.", nameof(filePath));
        if (!File.Exists(filePath))
            throw new FileNotFoundException("Excel file was not found.", filePath);

        var result = new ImportPmsDto();
        using var workbook = new XLWorkbook(filePath);
        ReadWbs(workbook, result);
        ReadActivities(workbook, result);
        Validate(result);
        return Task.FromResult(result);
    }

    private static void ReadWbs(XLWorkbook workbook, ImportPmsDto result)
    {
        if (!workbook.Worksheets.Contains("WBS")) return;
        var sheet = workbook.Worksheet("WBS");
        foreach (var row in sheet.RowsUsed().Skip(1))
        {
            if (row.Cell(1).IsEmpty()) continue;
            var code = row.Cell(1).GetString().Trim();
            if (string.IsNullOrWhiteSpace(code)) continue;
            result.WbsNodes.Add(new ImportWbsDto
            {
                Code = code,
                ParentCode = row.Cell(2).GetString().Trim(),
                Name = row.Cell(3).GetString().Trim(),
                Level = GetInt(row.Cell(4)),
                Budget = GetDecimal(row.Cell(5)),
                WeightFactor = GetPercentage(row.Cell(6)),
                Progress = GetPercentage(row.Cell(7))
            });
        }
    }

    private static void ReadActivities(XLWorkbook workbook, ImportPmsDto result)
    {
        if (!workbook.Worksheets.Contains("Activities")) return;
        var sheet = workbook.Worksheet("Activities");
        foreach (var row in sheet.RowsUsed().Skip(1))
        {
            if (row.Cell(1).IsEmpty()) continue;
            var code = row.Cell(1).GetString().Trim();
            if (string.IsNullOrWhiteSpace(code)) continue;

            var actualStartCell = row.Cell(7);
            var actualFinishCell = row.Cell(8);
            var actualStartText = actualStartCell.GetString().Trim();
            var actualFinishText = actualFinishCell.GetString().Trim();

            result.Activities.Add(new ImportActivityDto
            {
                Code = code,
                WbsCode = row.Cell(2).GetString().Trim(),
                Name = row.Cell(3).GetString().Trim(),
                Duration = GetInt(row.Cell(4)),
                PlannedStart = GetDate(row.Cell(5)),
                PlannedFinish = GetDate(row.Cell(6)),
                ActualStartSpecified = !actualStartCell.IsEmpty(),
                ActualFinishSpecified = !actualFinishCell.IsEmpty(),
                ActualStart = ParseActualDate(actualStartCell, actualStartText),
                ActualFinish = ParseActualDate(actualFinishCell, actualFinishText),
                Budget = GetDecimal(row.Cell(9)),
                Weight = GetPercentage(row.Cell(10)),
                Progress = GetPercentage(row.Cell(11)),
                RemainingDuration = GetInt(row.Cell(12)),
                Status = row.Cell(13).IsEmpty() ? "NotStarted" : row.Cell(13).GetString().Trim(),
                IsMilestone = GetBoolean(row.Cell(14))
            });
        }
    }

    private static DateTime? ParseActualDate(IXLCell cell, string text)
    {
        if (cell.IsEmpty() || string.Equals(text, "[CLEAR]", StringComparison.OrdinalIgnoreCase))
            return null;
        return GetDate(cell);
    }

    private static void Validate(ImportPmsDto dto)
    {
        if (dto.WbsNodes.Count == 0 && dto.Activities.Count == 0)
            throw new Exception("The Excel file does not contain any WBS or Activities data.");

        var wbsCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var wbs in dto.WbsNodes)
        {
            if (string.IsNullOrWhiteSpace(wbs.Code)) throw new Exception("WBS Code cannot be empty.");
            if (!wbsCodes.Add(wbs.Code)) throw new Exception($"Duplicate WBS Code '{wbs.Code}'.");
            if (string.IsNullOrWhiteSpace(wbs.Name)) throw new Exception($"WBS '{wbs.Code}' name is empty.");
            if (wbs.Level < 0) throw new Exception($"WBS '{wbs.Code}' has an invalid Level.");
            if (wbs.Budget < 0) throw new Exception($"WBS '{wbs.Code}' has a negative Budget.");
            if (wbs.WeightFactor is < 0 or > 100) throw new Exception($"WBS '{wbs.Code}' has an invalid Weight.");
            if (wbs.Progress is < 0 or > 100) throw new Exception($"WBS '{wbs.Code}' has an invalid Progress.");
        }

        foreach (var wbs in dto.WbsNodes)
        {
            if (string.IsNullOrWhiteSpace(wbs.ParentCode)) continue;
            if (!wbsCodes.Contains(wbs.ParentCode))
                throw new Exception($"WBS '{wbs.Code}' references unknown ParentCode '{wbs.ParentCode}'.");
            if (string.Equals(wbs.Code, wbs.ParentCode, StringComparison.OrdinalIgnoreCase))
                throw new Exception($"WBS '{wbs.Code}' cannot be its own parent.");
        }

        var activityCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var activity in dto.Activities)
        {
            if (string.IsNullOrWhiteSpace(activity.Code)) throw new Exception("Activity Code cannot be empty.");
            if (!activityCodes.Add(activity.Code)) throw new Exception($"Duplicate Activity Code '{activity.Code}'.");
            if (string.IsNullOrWhiteSpace(activity.WbsCode)) throw new Exception($"Activity '{activity.Code}' has no WBS.");
            if (!wbsCodes.Contains(activity.WbsCode))
                throw new Exception($"Activity '{activity.Code}' references unknown WBS '{activity.WbsCode}'.");
            if (activity.Duration < 0) throw new Exception($"Activity '{activity.Code}' has an invalid Duration.");
            if (activity.Budget < 0) throw new Exception($"Activity '{activity.Code}' has a negative Budget.");
            if (activity.Weight is < 0 or > 100) throw new Exception($"Activity '{activity.Code}' has an invalid Weight.");
            if (activity.Progress is < 0 or > 100) throw new Exception($"Activity '{activity.Code}' has an invalid Progress.");
            if (activity.PlannedStart.HasValue && activity.PlannedFinish.HasValue &&
                activity.PlannedFinish.Value < activity.PlannedStart.Value)
                throw new Exception($"Activity '{activity.Code}' has PlannedFinish earlier than PlannedStart.");
            if (activity.ActualStart.HasValue && activity.ActualFinish.HasValue &&
                activity.ActualFinish.Value < activity.ActualStart.Value)
                throw new Exception($"Activity '{activity.Code}' has ActualFinish earlier than ActualStart.");
        }
    }

    private static int GetInt(IXLCell cell)
        => cell.IsEmpty() || !cell.TryGetValue<int>(out var value) ? 0 : value;

    private static decimal GetDecimal(IXLCell cell)
        => cell.IsEmpty() || !cell.TryGetValue<decimal>(out var value) ? 0m : value;

    private static decimal GetPercentage(IXLCell cell)
    {
        if (cell.IsEmpty()) return 0m;
        if (cell.DataType == XLDataType.Number)
        {
            var value = cell.GetValue<decimal>();
            return value is >= 0 and <= 1 ? value * 100m : value;
        }
        var text = cell.GetString().Replace("%", "").Trim();
        if (!decimal.TryParse(text, out var parsed)) return 0m;
        return parsed is >= 0 and <= 1 ? parsed * 100m : parsed;
    }

    private static DateTime? GetDate(IXLCell cell)
    {
        if (cell.IsEmpty()) return null;
        if (cell.TryGetValue<DateTime>(out var value)) return value;
        return DateTime.TryParse(cell.GetString().Trim(), out var parsed) ? parsed : null;
    }

    private static bool GetBoolean(IXLCell cell)
    {
        if (cell.IsEmpty()) return false;
        if (cell.TryGetValue<bool>(out var value)) return value;
        return bool.TryParse(cell.GetString().Trim(), out var parsed) && parsed;
    }
}