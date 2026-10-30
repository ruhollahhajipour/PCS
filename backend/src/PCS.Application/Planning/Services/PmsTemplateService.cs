using ClosedXML.Excel;
using PCS.Application.Planning.Interfaces;

namespace PCS.Application.Planning.Services;

public class PmsTemplateService : IPmsTemplateService
{
    public byte[] GenerateTemplate()
    {
        using var workbook = new XLWorkbook();
        var instructions = workbook.Worksheets.Add("Instructions");
        instructions.Cell("A1").Value = "PCS PMS — Excel Exchange Workbook";
        instructions.Cell("A3").Value = "PMS";
        instructions.Cell("B3").Value = "Hierarchical overview and style guide. Use WBS and Activities as the editable import sources.";
        instructions.Cell("A4").Value = "WBS";
        instructions.Cell("B4").Value = "One row per WBS node. Code is unique within the project; ParentCode may reference a later row.";
        instructions.Cell("A5").Value = "Activities";
        instructions.Cell("B5").Value = "One row per activity. Activity Code is unique within the project; WbsCode must exist in WBS.";
        instructions.Cell("A6").Value = "Actual dates";
        instructions.Cell("B6").Value = "Leave ActualStart/ActualFinish blank to preserve existing values. Enter [CLEAR] to explicitly clear an actual date.";
        instructions.Cell("A7").Value = "Update policy";
        instructions.Cell("B7").Value = "New codes are added, matching codes are updated, and records missing from the file are not deleted.";
        instructions.Cell("A8").Value = "Scheduling";
        instructions.Cell("B8").Value = "PCS validates imported data and runs its own scheduling logic. Excel formulas are not authoritative for schedule calculations.";
        instructions.Cell("A9").Value = "Important";
        instructions.Cell("B9").Value = "Do not rename the import sheets or their column headers. Remove example rows before importing if you use a populated export.";

        var wbs = workbook.Worksheets.Add("WBS");
        string[] wbsHeaders = { "Code", "ParentCode", "Name", "Level", "Budget", "Weight", "Progress" };
        for (var i = 0; i < wbsHeaders.Length; i++) wbs.Cell(1, i + 1).Value = wbsHeaders[i];

        var activities = workbook.Worksheets.Add("Activities");
        string[] activityHeaders =
        {
            "Code", "WbsCode", "Name", "Duration", "PlannedStart", "PlannedFinish",
            "ActualStart", "ActualFinish", "Budget", "Weight", "Progress",
            "RemainingDuration", "Status", "IsMilestone"
        };
        for (var i = 0; i < activityHeaders.Length; i++) activities.Cell(1, i + 1).Value = activityHeaders[i];

        var pms = workbook.Worksheets.Add("PMS");
        pms.Cell("A1").Value = "PROJECT MANAGEMENT & CONTROL";
        pms.Cell("A2").Value = "WBS hierarchy, activity progress and project roll-up";
        string[] pmsHeaders = { "Type", "Code", "Parent Code", "Description", "WBS Level", "Duration", "Planned Start", "Planned Finish", "Actual Start", "Actual Finish", "Progress", "Budget" };
        for (var i = 0; i < pmsHeaders.Length; i++) pms.Cell(4, i + 1).Value = pmsHeaders[i];
        pms.Cell("A5").Value = "Project";
        pms.Cell("B5").FormulaA1 = "IFERROR(INDEX(WBS!A:A,MATCH(0,WBS!D:D,0)),\"\")";
        pms.Cell("D5").FormulaA1 = "IFERROR(INDEX(WBS!C:C,MATCH(0,WBS!D:D,0)),\"Project\")";
        pms.Cell("E5").Value = 0;
        pms.Cell("K5").FormulaA1 = "IFERROR(SUMPRODUCT(Activities!I2:I1000,Activities!K2:K1000)/SUM(Activities!I2:I1000),0)";
        pms.Cell("L5").FormulaA1 = "SUM(Activities!I2:I1000)";
        pms.Cell("A7").Value = "The PMS sheet is the visual summary. Import source data is maintained in WBS and Activities.";
        pms.Cell("A8").Value = "WBS group colors are depth-based: project/root strongest, deeper WBS levels progressively lighter; activity rows remain unfilled.";

        var colors = new[] { "#2563EB", "#4F83E8", "#78A2EF", "#A5C2F4", "#D3E1FA" };
        for (var level = 0; level < colors.Length; level++)
        {
            var row = 10 + level;
            pms.Cell(row, 1).Value = level == 0 ? "Project / Level 0" : $"WBS Level {level}";
            pms.Cell(row, 4).Value = "Automatic hierarchy color sample";
            var range = pms.Range(row, 1, row, pmsHeaders.Length);
            range.Style.Fill.SetBackgroundColor(XLColor.FromHtml(colors[level]));
            range.Style.Font.FontColor = level < 2 ? XLColor.White : XLColor.FromHtml("#0F172A");
            range.Style.Font.Bold = true;
        }
        pms.Cell("A16").Value = "Activity";
        pms.Cell("D16").Value = "No background fill";
        pms.Range("A16:L16").Style.Fill.SetBackgroundColor(XLColor.White);
        pms.Outline.SummaryVLocation = XLOutlineSummaryVLocation.Top;

        foreach (var sheet in workbook.Worksheets)
        {
            sheet.Style.Font.FontName = "Aptos";
            sheet.Style.Font.FontSize = 10;
            sheet.SheetView.FreezeRows(sheet.Name == "PMS" ? 4 : 1);
            sheet.PageSetup.PageOrientation = XLPageOrientation.Landscape;
        }

        foreach (var sheet in new[] { wbs, activities })
        {
            var lastColumn = sheet.LastColumnUsed()?.ColumnNumber() ?? 1;
            var header = sheet.Range(1, 1, 1, lastColumn);
            header.Style.Fill.SetBackgroundColor(XLColor.FromHtml("#0F172A"));
            header.Style.Font.FontColor = XLColor.White;
            header.Style.Font.Bold = true;
            header.Style.Alignment.WrapText = true;
            sheet.Range(1, 1, 2, lastColumn).SetAutoFilter();
            sheet.SheetView.FreezeRows(1);
            sheet.Columns().AdjustToContents(10, 36);
        }

        pms.Range(1, 1, 1, pmsHeaders.Length).Merge();
        pms.Range(1, 1, 1, pmsHeaders.Length).Style.Fill.SetBackgroundColor(XLColor.FromHtml("#0F172A"));
        pms.Range(1, 1, 1, pmsHeaders.Length).Style.Font.FontColor = XLColor.White;
        pms.Range(1, 1, 1, pmsHeaders.Length).Style.Font.Bold = true;
        pms.Range(1, 1, 1, pmsHeaders.Length).Style.Font.FontSize = 16;
        pms.Range(2, 1, 2, pmsHeaders.Length).Merge();
        pms.Range(2, 1, 2, pmsHeaders.Length).Style.Fill.SetBackgroundColor(XLColor.FromHtml("#F6F8FB"));
        pms.Range(4, 1, 4, pmsHeaders.Length).Style.Fill.SetBackgroundColor(XLColor.FromHtml("#2563EB"));
        pms.Range(4, 1, 4, pmsHeaders.Length).Style.Font.FontColor = XLColor.White;
        pms.Range(4, 1, 4, pmsHeaders.Length).Style.Font.Bold = true;
        pms.Column(11).Style.NumberFormat.Format = "0.00%";
        activities.Column(5).Style.DateFormat.Format = "yyyy-mm-dd";
        activities.Column(6).Style.DateFormat.Format = "yyyy-mm-dd";
        activities.Column(7).Style.DateFormat.Format = "yyyy-mm-dd";
        activities.Column(8).Style.DateFormat.Format = "yyyy-mm-dd";
        activities.Column(11).Style.NumberFormat.Format = "0.00";
        wbs.Column(6).Style.NumberFormat.Format = "0.00";
        wbs.Column(7).Style.NumberFormat.Format = "0.00";
        pms.Columns().AdjustToContents(10, 38);

        instructions.Column(1).Width = 22;
        instructions.Column(2).Width = 100;
        instructions.Range("A1:B1").Merge();
        instructions.Range("A1:B1").Style.Fill.SetBackgroundColor(XLColor.FromHtml("#0F172A"));
        instructions.Range("A1:B1").Style.Font.FontColor = XLColor.White;
        instructions.Range("A1:B1").Style.Font.Bold = true;
        instructions.Range("A1:B1").Style.Font.FontSize = 16;
        instructions.Column(2).Style.Alignment.WrapText = true;
        instructions.Rows().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}