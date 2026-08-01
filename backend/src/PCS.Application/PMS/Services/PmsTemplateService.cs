using ClosedXML.Excel;
using PCS.Application.PMS.Interfaces;

namespace PCS.Application.PMS.Services;

public class PmsTemplateService : IPmsTemplateService
{
    public byte[] GenerateTemplate()
    {
        using var workbook = new XLWorkbook();


        // ======================
        // WBS Sheet
        // ======================

        var wbs = workbook.Worksheets.Add("WBS");

        wbs.Cell(1, 1).Value = "Code";
        wbs.Cell(1, 2).Value = "ParentCode";
        wbs.Cell(1, 3).Value = "Name";
        wbs.Cell(1, 4).Value = "Level";
        wbs.Cell(1, 5).Value = "Weight";


        wbs.Row(1).Style.Font.Bold = true;


        // Sample

        wbs.Cell(2,1).Value="1";
        wbs.Cell(2,3).Value="Engineering";
        wbs.Cell(2,4).Value=1;
        wbs.Cell(2,5).Value=20;



        // ======================
        // Activities Sheet
        // ======================

        var act = workbook.Worksheets.Add("Activities");


        act.Cell(1,1).Value="Code";
        act.Cell(1,2).Value="WbsCode";
        act.Cell(1,3).Value="Name";
        act.Cell(1,4).Value="Duration";
        act.Cell(1,5).Value="PlannedStart";
        act.Cell(1,6).Value="PlannedFinish";
        act.Cell(1,7).Value="Budget";
        act.Cell(1,8).Value="Weight";


        act.Row(1).Style.Font.Bold = true;



        // ======================
        // Relationships
        // ======================

        var rel = workbook.Worksheets.Add("Relationships");


        rel.Cell(1,1).Value="Predecessor";
        rel.Cell(1,2).Value="Successor";
        rel.Cell(1,3).Value="Type";
        rel.Cell(1,4).Value="Lag";


        rel.Row(1).Style.Font.Bold = true;



        // ======================
        // Calendar
        // ======================

        var cal = workbook.Worksheets.Add("Calendar");


        cal.Cell(1,1).Value="Name";
        cal.Cell(1,2).Value="WorkingDaysPerWeek";
        cal.Cell(1,3).Value="WorkingHoursPerDay";


        cal.Row(1).Style.Font.Bold = true;



        foreach(var sheet in workbook.Worksheets)
        {
            sheet.Columns().AdjustToContents();
        }



        using var stream = new MemoryStream();

        workbook.SaveAs(stream);


        return stream.ToArray();
    }
}