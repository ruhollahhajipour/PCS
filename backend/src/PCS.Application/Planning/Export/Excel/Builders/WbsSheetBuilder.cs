using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class WbsSheetBuilder
{
    private const int HeaderRow = 5;
    private const int FirstDataRow = 6;

    private readonly Dictionary<Guid, int> _rowMap = new();



    public void Build(
        XLWorkbook workbook,
        ExportPmsDto dto)
    {
        var sheet =
            workbook.Worksheets.Add(dto.WbsSheetName);


        sheet.ShowGridLines = false;


        var theme =
            ThemePalette.Create(
                dto.ThemePrimaryColor,
                dto.ThemeDarkColor,
                dto.ThemeSecondaryColor,
                dto.ThemeBorderColor);



        //----------------------------------------------------
        // Project Header
        //----------------------------------------------------

        sheet.Range("A1:N2")
            .Merge();



        var title =
            sheet.Cell("A1");



        title.Value =
            $"{dto.ProjectName}\nOVERALL PROJECT PROGRESS";



        title.Style.Font.Bold = true;

        title.Style.Font.FontSize = 18;


        title.Style.Font.FontColor =
            XLColor.White;



        title.Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Dark);



        title.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;


        title.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;





        //----------------------------------------------------
        // Overall Progress
        //----------------------------------------------------

        sheet.Cell("A3")
            .Value =
            "Overall Progress";



        sheet.Cell("B3")
            .Value =
            dto.OverallProgress / 100m;



        sheet.Cell("B3")
            .Style.NumberFormat.Format =
            "0.00%";





        //----------------------------------------------------
        // Headers
        //----------------------------------------------------

        string[] headers =
        {
            "WBS Code",
            "Parent",
            "WBS Name",
            "Level",
            "Budget",
            "Weight",
            "Progress %",
            "W.V",
            "W.F",
            "EV",
            "PV",
            "AC",
            "CPI",
            "SPI"
        };



        for(int i = 0; i < headers.Length; i++)
        {
            sheet.Cell(
                HeaderRow,
                i + 1)
            .Value =
                headers[i];
        }





        int row =
            FirstDataRow;



        foreach(var node in dto.WbsNodes)
        {
            WriteNode(
                sheet,
                node,
                ref row,
                0);
        }




        ApplyFormatting(
            sheet,
            dto,
            row - 1);




        var maxLevel =
            dto.WbsNodes
            .SelectMany(
                GetAllNodes)
            .Max(
                x => x.Level);




        ApplyHierarchyFormatting(
            sheet,
            dto,
            row - 1,
            maxLevel);




        sheet.Outline.SummaryVLocation =
            XLOutlineSummaryVLocation.Top;



        sheet.Outline.SummaryHLocation =
            XLOutlineSummaryHLocation.Left;
    }








    //--------------------------------------------------------
    // Recursive Writer
    //--------------------------------------------------------

    private void WriteNode(
        IXLWorksheet sheet,
        WbsNodeDto node,
        ref int row,
        int outlineLevel)
    {
        int currentRow =
            row;



        _rowMap[node.Id] =
            currentRow;




        sheet.Cell(currentRow, 1)
            .Value =
            node.Code;



        sheet.Cell(currentRow, 2)
            .Value =
            node.ParentCode ?? "";



        sheet.Cell(currentRow, 3)
            .Value =
            node.Name;



        sheet.Cell(currentRow, 4)
            .Value =
            node.Level;



        sheet.Cell(currentRow, 5)
            .Value =
            node.Budget;



        sheet.Cell(currentRow, 6)
            .Value =
            node.Weight / 100m;



        sheet.Cell(currentRow, 7)
            .Value =
            node.Progress / 100m;



        sheet.Cell(currentRow, 8)
            .FormulaA1 =
            $"=F{currentRow}*G{currentRow}";



        sheet.Row(currentRow)
            .OutlineLevel =
            outlineLevel;



        row++;




        foreach(var child in node.Children)
        {
            WriteNode(
                sheet,
                child,
                ref row,
                outlineLevel + 1);
        }



        if(node.Children.Count > 0)
        {
            int firstChild =
                currentRow + 1;


            int lastChild =
                row - 1;



            sheet.Rows(
                firstChild,
                lastChild)
            .Group();



            sheet.Cell(currentRow,7)
                .FormulaA1 =
                $"=SUM(H{firstChild}:H{lastChild})/SUM(F{firstChild}:F{lastChild})";



            sheet.Cell(currentRow,8)
                .FormulaA1 =
                $"=SUM(H{firstChild}:H{lastChild})";
        }
    }
        //--------------------------------------------------------
    // Formatting
    //--------------------------------------------------------

    private static void ApplyFormatting(
        IXLWorksheet sheet,
        ExportPmsDto dto,
        int lastRow)
    {
        var theme =
            ThemePalette.Create(
                dto.ThemePrimaryColor,
                dto.ThemeDarkColor,
                dto.ThemeSecondaryColor,
                dto.ThemeBorderColor);



        var header =
            sheet.Row(HeaderRow);



        header.Style.Font.Bold = true;


        header.Style.Font.FontColor =
            XLColor.White;



        header.Style.Fill.BackgroundColor =
            XLColor.FromHtml(
                theme.Dark);



        header.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;



        header.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;





        if(sheet.RangeUsed() != null)
        {
            sheet.RangeUsed()!
                .SetAutoFilter();
        }





        // Budget

        sheet.Column(5)
            .Style.NumberFormat.Format =
            "#,##0";





        // Weight / Progress / WV / WF

        sheet.Columns(6,9)
            .Style.NumberFormat.Format =
            "0.00%";





        // EV / PV / AC

        sheet.Columns(10,12)
            .Style.NumberFormat.Format =
            "#,##0";





        // CPI / SPI

        sheet.Columns(13,14)
            .Style.NumberFormat.Format =
            "0.00";





        sheet.SheetView
            .FreezeRows(
                HeaderRow);





        sheet.Columns()
            .AdjustToContents();





        sheet.PageSetup.PageOrientation =
            XLPageOrientation.Landscape;



        sheet.PageSetup.PaperSize =
            XLPaperSize.A4Paper;



        sheet.PageSetup.PagesWide = 1;



        sheet.TabColor =
            XLColor.FromHtml(
                theme.Primary);
    }
        //--------------------------------------------------------
    // Dynamic Hierarchy Formatting
    //--------------------------------------------------------

    private static void ApplyHierarchyFormatting(
        IXLWorksheet sheet,
        ExportPmsDto dto,
        int lastRow,
        int maxLevel)
    {
        var theme =
            ThemePalette.Create(
                dto.ThemePrimaryColor,
                dto.ThemeDarkColor,
                dto.ThemeSecondaryColor,
                dto.ThemeBorderColor);



        for(
            int row = FirstDataRow;
            row <= lastRow;
            row++)
        {
            int level =
                sheet.Cell(row,4)
                    .GetValue<int>();



            var range =
                sheet.Range(
                    row,
                    1,
                    row,
                    14);



            // Activity
            if(level == 0)
            {
                range.Style.Fill.BackgroundColor =
                    XLColor.White;


                continue;
            }




            var levelColor =
                theme.GetWbsLevelColor(
                    level,
                    maxLevel);



            range.Style.Fill.BackgroundColor =
                XLColor.FromHtml(
                    levelColor);





            // Parent WBS Bold

            range.Style.Font.Bold =
                level < maxLevel;





            sheet.Cell(row,3)
                .Style.Alignment.Indent =
                level;





            if(level > 0)
            {
                sheet.Row(row)
                    .Collapse();
            }
        }
    }







    //--------------------------------------------------------
    // Get All WBS Nodes
    //--------------------------------------------------------

    private static IEnumerable<WbsNodeDto> GetAllNodes(
        WbsNodeDto node)
    {
        yield return node;



        foreach(var child in node.Children)
        {
            foreach(var item in GetAllNodes(child))
            {
                yield return item;
            }
        }
    }
}