using ClosedXML.Excel;

using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;

namespace PCS.Application.Planning.Services;

public sealed class PmsExcelService
    : IPmsExcelService
{
    private readonly IPcsProfessionalPmsExporter _exporter;


    public PmsExcelService(
        IPcsProfessionalPmsExporter exporter)
    {
        _exporter = exporter;
    }



    // =====================================================
    // EXPORT PMS
    // =====================================================

    public Task<byte[]> GeneratePmsExcelAsync(
        ExportPmsDto dto)
    {
        return _exporter.GenerateAsync(dto);
    }



    // =====================================================
    // IMPORT PMS
    // =====================================================

    public Task<ImportPmsDto> ReadPmsExcelAsync(
        string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            throw new ArgumentException(
                "Excel file path is required.",
                nameof(filePath));


        if (!File.Exists(filePath))
            throw new FileNotFoundException(
                "Excel file was not found.",
                filePath);


        var result = new ImportPmsDto();


        using var workbook =
            new XLWorkbook(filePath);


        ReadWbs(
            workbook,
            result);


        ReadActivities(
            workbook,
            result);


        Validate(result);


        return Task.FromResult(result);
    }



    // =====================================================
    // READ WBS
    //
    // Template:
    //
    // Code
    // ParentCode
    // Name
    // Level
    // Budget
    // Weight
    // Progress
    // =====================================================

    private static void ReadWbs(
        XLWorkbook workbook,
        ImportPmsDto result)
    {
        if (!workbook.Worksheets.Contains("WBS"))
            return;


        var sheet =
            workbook.Worksheet("WBS");


        foreach (var row in sheet.RowsUsed().Skip(1))
        {
            if (row.Cell(1).IsEmpty())
                continue;


            var code =
                row.Cell(1)
                   .GetString()
                   .Trim();


            if (string.IsNullOrWhiteSpace(code))
                continue;


            result.WbsNodes.Add(
                new ImportWbsDto
                {
                    // Column 1
                    Code = code,


                    // Column 2
                    ParentCode =
                        row.Cell(2)
                           .GetString()
                           .Trim(),


                    // Column 3
                    Name =
                        row.Cell(3)
                           .GetString()
                           .Trim(),


                    // Column 4
                    Level =
                        GetInt(row.Cell(4)),


                    // Column 5
                    Budget =
                        GetDecimal(row.Cell(5)),


                    // Column 6
                    // Weight Factor
                    WeightFactor =
                        GetPercentage(row.Cell(6)),


                    // Weight Value is not part
                    // of the current import template.
                    //
                    // It remains zero here and can
                    // be calculated later by the
                    // PMS service if required.
                    WeightValue = 0m,


                    // Column 7
                    Progress =
                        GetPercentage(row.Cell(7))
                });
        }
    }



    // =====================================================
    // READ ACTIVITIES
    //
    // Template:
    //
    // Code
    // WbsCode
    // Name
    // Duration
    // PlannedStart
    // PlannedFinish
    // Budget
    // Weight
    // Progress
    // =====================================================

    private static void ReadActivities(
        XLWorkbook workbook,
        ImportPmsDto result)
    {
        if (!workbook.Worksheets.Contains("Activities"))
            return;


        var sheet =
            workbook.Worksheet("Activities");


        foreach (var row in sheet.RowsUsed().Skip(1))
        {
            if (row.Cell(1).IsEmpty())
                continue;


            var code =
                row.Cell(1)
                   .GetString()
                   .Trim();


            if (string.IsNullOrWhiteSpace(code))
                continue;


            result.Activities.Add(
                new ImportActivityDto
                {
                    // Column 1
                    Code = code,


                    // Column 2
                    WbsCode =
                        row.Cell(2)
                           .GetString()
                           .Trim(),


                    // Column 3
                    Name =
                        row.Cell(3)
                           .GetString()
                           .Trim(),


                    // Column 4
                    Duration =
                        GetInt(row.Cell(4)),


                    // Column 5
                    PlannedStart =
                        GetDate(row.Cell(5)),


                    // Column 6
                    PlannedFinish =
                        GetDate(row.Cell(6)),


                    // Column 7
                    Budget =
                        GetDecimal(row.Cell(7)),


                    // Column 8
                    Weight =
                        GetPercentage(row.Cell(8)),


                    // Column 9
                    Progress =
                        GetPercentage(row.Cell(9))
                });
        }
    }



    // =====================================================
    // VALIDATION
    // =====================================================

    private static void Validate(
        ImportPmsDto dto)
    {
        if (dto.WbsNodes.Count == 0 &&
            dto.Activities.Count == 0)
        {
            throw new Exception(
                "The Excel file does not contain any WBS or Activities data.");
        }



        // -------------------------------------------------
        // WBS
        // -------------------------------------------------

        var wbsCodes =
            new HashSet<string>(
                StringComparer.OrdinalIgnoreCase);


        foreach (var wbs in dto.WbsNodes)
        {
            if (string.IsNullOrWhiteSpace(wbs.Code))
            {
                throw new Exception(
                    "WBS Code cannot be empty.");
            }


            if (!wbsCodes.Add(wbs.Code))
            {
                throw new Exception(
                    $"Duplicate WBS Code '{wbs.Code}'.");
            }


            if (string.IsNullOrWhiteSpace(wbs.Name))
            {
                throw new Exception(
                    $"WBS '{wbs.Code}' name is empty.");
            }


            if (wbs.Level < 0)
            {
                throw new Exception(
                    $"WBS '{wbs.Code}' has an invalid Level.");
            }


            if (wbs.Budget < 0)
            {
                throw new Exception(
                    $"WBS '{wbs.Code}' has a negative Budget.");
            }


            if (wbs.WeightFactor < 0 ||
                wbs.WeightFactor > 100)
            {
                throw new Exception(
                    $"WBS '{wbs.Code}' has an invalid Weight. " +
                    "Weight must be between 0 and 100.");
            }


            if (wbs.Progress < 0 ||
                wbs.Progress > 100)
            {
                throw new Exception(
                    $"WBS '{wbs.Code}' has an invalid Progress. " +
                    "Progress must be between 0 and 100.");
            }


            if (!string.IsNullOrWhiteSpace(wbs.ParentCode) &&
                !wbsCodes.Contains(wbs.ParentCode))
            {
                // Parent may appear later in Excel,
                // so this relationship is checked
                // after all WBS rows have been loaded.
            }
        }


        // -------------------------------------------------
        // Validate WBS parents after all rows are loaded
        // -------------------------------------------------

        foreach (var wbs in dto.WbsNodes)
        {
            if (string.IsNullOrWhiteSpace(wbs.ParentCode))
                continue;


            if (!wbsCodes.Contains(wbs.ParentCode))
            {
                throw new Exception(
                    $"WBS '{wbs.Code}' references " +
                    $"unknown ParentCode '{wbs.ParentCode}'.");
            }


            if (string.Equals(
                    wbs.Code,
                    wbs.ParentCode,
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new Exception(
                    $"WBS '{wbs.Code}' cannot be its own parent.");
            }
        }



        // -------------------------------------------------
        // Activities
        // -------------------------------------------------

        var activityCodes =
            new HashSet<string>(
                StringComparer.OrdinalIgnoreCase);


        foreach (var activity in dto.Activities)
        {
            if (string.IsNullOrWhiteSpace(activity.Code))
            {
                throw new Exception(
                    "Activity Code cannot be empty.");
            }


            if (!activityCodes.Add(activity.Code))
            {
                throw new Exception(
                    $"Duplicate Activity Code '{activity.Code}'.");
            }


            if (string.IsNullOrWhiteSpace(activity.WbsCode))
            {
                throw new Exception(
                    $"Activity '{activity.Code}' has no WBS.");
            }


            if (!wbsCodes.Contains(activity.WbsCode))
            {
                throw new Exception(
                    $"Activity '{activity.Code}' references " +
                    $"unknown WBS '{activity.WbsCode}'.");
            }


            if (activity.Duration < 0)
            {
                throw new Exception(
                    $"Activity '{activity.Code}' has an invalid Duration.");
            }


            if (activity.Budget < 0)
            {
                throw new Exception(
                    $"Activity '{activity.Code}' has a negative Budget.");
            }


            if (activity.Weight < 0 ||
                activity.Weight > 100)
            {
                throw new Exception(
                    $"Activity '{activity.Code}' has an invalid Weight. " +
                    "Weight must be between 0 and 100.");
            }


            if (activity.Progress < 0 ||
                activity.Progress > 100)
            {
                throw new Exception(
                    $"Activity '{activity.Code}' has an invalid Progress. " +
                    "Progress must be between 0 and 100.");
            }


            if (activity.PlannedStart.HasValue &&
                activity.PlannedFinish.HasValue &&
                activity.PlannedFinish.Value <
                activity.PlannedStart.Value)
            {
                throw new Exception(
                    $"Activity '{activity.Code}' has a " +
                    "PlannedFinish earlier than PlannedStart.");
            }
        }
    }



    // =====================================================
    // INTEGER
    // =====================================================

    private static int GetInt(
        IXLCell cell)
    {
        if (cell.IsEmpty())
            return 0;


        return cell.TryGetValue<int>(
            out var value)
            ? value
            : 0;
    }



    // =====================================================
    // DECIMAL
    // =====================================================

    private static decimal GetDecimal(
        IXLCell cell)
    {
        if (cell.IsEmpty())
            return 0m;


        return cell.TryGetValue<decimal>(
            out var value)
            ? value
            : 0m;
    }



    // =====================================================
    // PERCENTAGE
    //
    // Supports:
    //
    // 0.1   -> 10
    // 10    -> 10
    // 10%   -> 10
    // 0.25  -> 25
    // 25%   -> 25
    // =====================================================

    private static decimal GetPercentage(
        IXLCell cell)
    {
        if (cell.IsEmpty())
            return 0m;


        if (cell.DataType == XLDataType.Number)
        {
            var value =
                cell.GetValue<decimal>();


            if (value >= 0 &&
                value <= 1)
            {
                return value * 100m;
            }


            return value;
        }


        var text =
            cell.GetString()
                .Replace("%", "")
                .Trim();


        if (decimal.TryParse(
                text,
                out var result))
        {
            if (result >= 0 &&
                result <= 1)
            {
                return result * 100m;
            }


            return result;
        }


        return 0m;
    }



    // =====================================================
    // DATE
    // =====================================================

    private static DateTime? GetDate(
        IXLCell cell)
    {
        if (cell.IsEmpty())
            return null;


        if (cell.TryGetValue<DateTime>(
                out var value))
        {
            return value;
        }


        var text =
            cell.GetString().Trim();


        if (DateTime.TryParse(
                text,
                out var parsed))
        {
            return parsed;
        }


        return null;
    }
}