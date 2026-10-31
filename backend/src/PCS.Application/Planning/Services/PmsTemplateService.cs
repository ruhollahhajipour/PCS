using ClosedXML.Excel;
using PCS.Application.Planning.Interfaces;

namespace PCS.Application.Planning.Services;

public class PmsTemplateService : IPmsTemplateService
{
    public byte[] GenerateTemplate()
    {
        using var workbook = new XLWorkbook();


        // ======================
        // Instructions
        // ======================

        var info =
            workbook.Worksheets.Add("Instructions");


        info.Cell(1,1).Value =
            "PCS PMS Import Template";


        info.Cell(3,1).Value =
            "WBS sheet contains project breakdown structure.";


        info.Cell(4,1).Value =
            "Activities sheet contains project activities.";


        info.Row(1).Style.Font.Bold = true;




        // ======================
        // WBS
        // ======================

        var wbs =
            workbook.Worksheets.Add("WBS");


        string[] wbsHeaders =
        {
            "Code",
            "ParentCode",
            "Name",
            "Level",
            "Budget",
            "Weight",
            "Progress"
        };


        for(int i = 0; i < wbsHeaders.Length; i++)
        {
            wbs.Cell(1,i+1).Value =
                wbsHeaders[i];
        }



        wbs.Cell(2,1).Value = "1";
        wbs.Cell(2,3).Value = "Engineering";
        wbs.Cell(2,4).Value = 1;
        wbs.Cell(2,5).Value = 100000;
        wbs.Cell(2,6).Value = 100;
        wbs.Cell(2,7).Value = 0;



        // ======================
        // Activities
        // ======================

        var act =
            workbook.Worksheets.Add("Activities");



        string[] activityHeaders =
        {
            "Code",
            "WbsCode",
            "Name",
            "Duration",
            "PlannedStart",
            "PlannedFinish",
            "Budget",
            "Weight",
            "Progress"
        };


        for(int i = 0; i < activityHeaders.Length; i++)
        {
            act.Cell(1,i+1).Value =
                activityHeaders[i];
        }



        act.Cell(2,1).Value="A-001";
        act.Cell(2,2).Value="1";
        act.Cell(2,3).Value="Design";
        act.Cell(2,4).Value=10;
        act.Cell(2,5).Value=DateTime.Today;
        act.Cell(2,6).Value=DateTime.Today.AddDays(10);
        act.Cell(2,7).Value=50000;
        act.Cell(2,8).Value=50;
        act.Cell(2,9).Value=0;




        // ======================
        // Relationships
        // ======================

        var rel =
            workbook.Worksheets.Add("Relationships");


        rel.Cell(1,1).Value="Predecessor";
        rel.Cell(1,2).Value="Successor";
        rel.Cell(1,3).Value="Type";
        rel.Cell(1,4).Value="Lag";





        // ======================
        // Calendar
        // ======================

        var cal =
            workbook.Worksheets.Add("Calendar");


        cal.Cell(1,1).Value="Name";
        cal.Cell(1,2).Value="WorkingDaysPerWeek";
        cal.Cell(1,3).Value="WorkingHoursPerDay";




        // ======================
        // Formatting
        // ======================

        foreach(var sheet in workbook.Worksheets)
        {
            var header =
                sheet.Row(1);


            header.Style.Font.Bold = true;


            sheet.RangeUsed()
                ?.SetAutoFilter();


            sheet.SheetView
                .FreezeRows(1);


            sheet.Columns()
                .AdjustToContents();
        }



        wbs.Column(6)
            .Style.NumberFormat.Format =
            "0.00";


        wbs.Column(7)
            .Style.NumberFormat.Format =
            "0.00";



        act.Column(8)
            .Style.NumberFormat.Format =
            "0.00";


        act.Column(9)
            .Style.NumberFormat.Format =
            "0.00";




        using var stream =
            new MemoryStream();


        workbook.SaveAs(stream);


        return stream.ToArray();
    }
}