using ClosedXML.Excel;
using PCS.Application.PMS.DTOs;
using PCS.Application.PMS.Interfaces;

namespace PCS.Application.PMS.Services;

public class PmsExcelService : IPmsExcelService
{
    public async Task<ImportPmsDto> ReadPmsExcelAsync(
        string filePath)
    {
        var result = new ImportPmsDto();


        using var workbook = new XLWorkbook(filePath);



        // WBS Sheet

        if (workbook.Worksheets.Contains("WBS"))
        {
            var sheet = workbook.Worksheet("WBS");


            foreach (var row in sheet.RowsUsed().Skip(1))
            {
                result.WbsNodes.Add(new WbsNodeDto
                {
                    Code = row.Cell(1).GetString(),

                    ParentCode = row.Cell(2).GetString(),

                    Name = row.Cell(3).GetString(),

                    Level = row.Cell(4).GetValue<int>(),

                    Weight = row.Cell(5).GetValue<decimal>()
                });
            }
        }



        // Activities Sheet

        if (workbook.Worksheets.Contains("Activities"))
        {
            var sheet = workbook.Worksheet("Activities");


            foreach (var row in sheet.RowsUsed().Skip(1))
            {
                result.Activities.Add(new ActivityDto
                {
                    Code = row.Cell(1).GetString(),

                    WbsCode = row.Cell(2).GetString(),

                    Name = row.Cell(3).GetString(),

                    Duration = row.Cell(4).GetValue<int>(),

                    PlannedStart = row.Cell(5).GetDateTime(),

                    PlannedFinish = row.Cell(6).GetDateTime(),

                    Budget = row.Cell(7).GetValue<decimal>(),

                    Weight = row.Cell(8).GetValue<decimal>()
                });
            }
        }


        return await Task.FromResult(result);
    }



    public async Task<byte[]> GeneratePmsExcelAsync(
        ExportPmsDto dto)
    {

        using var workbook = new XLWorkbook();


        // Summary

        var summary = workbook.Worksheets.Add(
            "Summary");


        summary.Cell(1, 1).Value = "Project";

        summary.Cell(1, 2).Value = dto.ProjectName;


        summary.Cell(2, 1).Value = "Budget";

        summary.Cell(2, 2).Value = dto.TotalBudget;


        summary.Cell(3, 1).Value = "Progress";

        summary.Cell(3, 2).Value = dto.OverallProgress;



        // WBS

        var wbsSheet = workbook.Worksheets.Add(
            "WBS");


        wbsSheet.Cell(1,1).Value="Code";
        wbsSheet.Cell(1,2).Value="Parent";
        wbsSheet.Cell(1,3).Value="Name";


        var row = 2;

        foreach(var item in dto.WbsNodes)
        {
            wbsSheet.Cell(row,1).Value=item.Code;
            wbsSheet.Cell(row,2).Value=item.ParentCode;
            wbsSheet.Cell(row,3).Value=item.Name;

            row++;
        }



        // Activities

        var actSheet = workbook.Worksheets.Add(
            "Activities");


        actSheet.Cell(1,1).Value="Code";
        actSheet.Cell(1,2).Value="WBS";
        actSheet.Cell(1,3).Value="Name";


        row = 2;

        foreach(var item in dto.Activities)
        {
            actSheet.Cell(row,1).Value=item.Code;
            actSheet.Cell(row,2).Value=item.WbsCode;
            actSheet.Cell(row,3).Value=item.Name;

            row++;
        }



        using var stream = new MemoryStream();

        workbook.SaveAs(stream);


        return await Task.FromResult(
            stream.ToArray());
    }
}