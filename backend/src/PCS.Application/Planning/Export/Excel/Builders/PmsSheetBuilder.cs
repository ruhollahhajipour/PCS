using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class PmsSheetBuilder
{
    private const int HeaderRow = 6;
    private const int FirstDataRow = 7;


    private int _currentRow;


    public void Build(
        XLWorkbook workbook,
        ExportPmsDto dto)
    {
        var sheet =
            workbook.Worksheets.Add("PMS");


        sheet.ShowGridLines = false;


        var theme =
            ThemePalette.PcsBlue();



        CreateTitle(
            sheet,
            dto,
            theme);



        CreateHeaders(
            sheet,
            theme);



        _currentRow = FirstDataRow;



        foreach (var root in dto.WbsNodes)
        {
            WriteNode(
                sheet,
                root,
                null);
        }



        var lastRow =
            _currentRow - 1;



        CreateKpiArea(
            sheet,
            lastRow);



        ApplyFormatting(
            sheet,
            lastRow,
            theme);
    }





    private void CreateTitle(
        IXLWorksheet sheet,
        ExportPmsDto dto,
        ThemePalette theme)
    {
        sheet.Range("A1:O2")
            .Merge();


        var cell =
            sheet.Cell("A1");


        cell.Value =
            $"{dto.ProjectName}\nPROJECT MANAGEMENT SYSTEM";



        cell.Style.Font.Bold = true;

        cell.Style.Font.FontSize = 18;


        cell.Style.Font.FontColor =
            XLColor.White;


        cell.Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Dark);



        cell.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;


        cell.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;
    }





    private void CreateHeaders(
        IXLWorksheet sheet,
        ThemePalette theme)
    {
        string[] headers =
        {
            "Code",
            "Parent",
            "Level",
            "Type",
            "Name",
            "Budget",
            "W.F %",
            "W.V %",
            "Progress %",
            "Weighted Progress %",
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
    }






    private int WriteNode(
        IXLWorksheet sheet,
        WbsNodeDto node,
        WbsNodeDto? parent)
    {

        int startRow =
            _currentRow;



        int row =
            _currentRow;



        WriteBasicData(
            sheet,
            row,
            node,
            parent);



        _currentRow++;




        foreach(var child in node.Children
                     .OrderBy(x => x.SortOrder))
        {
            WriteNode(
                sheet,
                child,
                node);
        }



        int endRow =
            _currentRow - 1;



        ApplyNodeFormula(
            sheet,
            row,
            startRow,
            endRow,
            node,
            parent);



        return row;
    }






    private void WriteBasicData(
        IXLWorksheet sheet,
        int row,
        WbsNodeDto node,
        WbsNodeDto? parent)
    {

        sheet.Cell(row,1)
            .Value =
            node.Code;



        sheet.Cell(row,2)
            .Value =
            parent?.Code;



        sheet.Cell(row,3)
            .Value =
            node.Level;



        sheet.Cell(row,4)
            .Value =
            node.IsActivity
                ? "Activity"
                : "WBS";



        sheet.Cell(row,5)
            .Value =
            node.Name;



        if(node.IsActivity)
        {
            sheet.Cell(row,6)
                .Value =
                node.Budget;


            sheet.Cell(row,9)
                .Value =
                node.Progress / 100m;
        }
    }
        private void ApplyNodeFormula(
        IXLWorksheet sheet,
        int row,
        int startRow,
        int endRow,
        WbsNodeDto node,
        WbsNodeDto? parent)
    {
        bool hasChildren =
            endRow > startRow;


        // ------------------------------------------
        // Budget
        // ------------------------------------------

        if (!node.IsActivity && hasChildren)
        {
            sheet.Cell(row, 6)
                .FormulaA1 =
                $"=SUM(F{startRow + 1}:F{endRow})";
        }



        // ------------------------------------------
        // W.F
        // Child Budget / Parent Budget
        // ------------------------------------------

        if (parent != null)
        {
            sheet.Cell(row, 7)
                .FormulaA1 =
                $"=IF(F{row}=0,0,F{row}/F{FindParentRow(sheet,row)})";
        }
        else
        {
            sheet.Cell(row,7)
                .Value = 1;
        }




        // ------------------------------------------
        // W.V
        // Row Budget / Project Budget
        // ------------------------------------------

        sheet.Cell(row,8)
            .FormulaA1 =
            $"=IF(F$7=0,0,F{row}/F$7)";





        // ------------------------------------------
        // Progress Roll-up
        // ------------------------------------------

        if (!node.IsActivity && hasChildren)
        {
            sheet.Cell(row,9)
                .FormulaA1 =
                $"=SUMPRODUCT(I{startRow + 1}:I{endRow},G{startRow + 1}:G{endRow})";
        }



        // ------------------------------------------
        // Weighted Progress
        // ------------------------------------------

        sheet.Cell(row,10)
            .FormulaA1 =
            $"=I{row}*H{row}";





        // ------------------------------------------
        // EV
        // ------------------------------------------

        if (node.IsActivity)
        {
            sheet.Cell(row,11)
                .FormulaA1 =
                $"=F{row}*I{row}";
        }
        else if (hasChildren)
        {
            sheet.Cell(row,11)
                .FormulaA1 =
                $"=SUM(K{startRow + 1}:K{endRow})";
        }





        // ------------------------------------------
        // PV / AC
        // ------------------------------------------

        if (node.IsActivity)
        {
            sheet.Cell(row,12)
                .Value =
                node.PlannedValue;


            sheet.Cell(row,13)
                .Value =
                node.ActualCost;
        }
        else if (hasChildren)
        {
            sheet.Cell(row,12)
                .FormulaA1 =
                $"=SUM(L{startRow + 1}:L{endRow})";


            sheet.Cell(row,13)
                .FormulaA1 =
                $"=SUM(M{startRow + 1}:M{endRow})";
        }





        // ------------------------------------------
        // CPI / SPI
        // ------------------------------------------

        sheet.Cell(row,14)
            .FormulaA1 =
            $"=IF(M{row}=0,0,K{row}/M{row})";


        sheet.Cell(row,15)
            .FormulaA1 =
            $"=IF(L{row}=0,0,K{row}/L{row})";



        ApplyRowStyle(
            sheet,
            row,
            node);
    }







    private void CreateKpiArea(
        IXLWorksheet sheet,
        int lastRow)
    {

        sheet.Cell("A4")
            .Value =
            "Total Items";


        sheet.Cell("B4")
            .FormulaA1 =
            $"=COUNTA(A{FirstDataRow}:A{lastRow})";



        sheet.Cell("D4")
            .Value =
            "Project Progress";


        sheet.Cell("E4")
            .FormulaA1 =
            $"=J{FirstDataRow}";


        sheet.Cell("E4")
            .Style.NumberFormat.Format =
            "0.00%";



        sheet.Cell("G4")
            .Value =
            "CPI";


        sheet.Cell("H4")
            .FormulaA1 =
            $"=N{FirstDataRow}";



        sheet.Cell("J4")
            .Value =
            "SPI";


        sheet.Cell("K4")
            .FormulaA1 =
            $"=O{FirstDataRow}";
    }








    private void ApplyRowStyle(
        IXLWorksheet sheet,
        int row,
        WbsNodeDto node)
    {

        var range =
            sheet.Range(
                row,
                1,
                row,
                15);



        if(node.IsActivity)
        {
            sheet.Cell(row,5)
                .Style.Alignment.Indent =
                node.Level;
        }
        else
        {
            range.Style.Font.Bold = true;

            sheet.Cell(row,5)
                .Style.Alignment.Indent =
                node.Level;
        }



        if(node.Level == 0)
        {
            range.Style.Fill.BackgroundColor =
                XLColor.FromHtml("#0F172A");

            range.Style.Font.FontColor =
                XLColor.White;
        }
        else if(node.Level == 1)
        {
            range.Style.Fill.BackgroundColor =
                XLColor.FromHtml("#2563EB");

            range.Style.Font.FontColor =
                XLColor.White;
        }
        else if(!node.IsActivity)
        {
            range.Style.Fill.BackgroundColor =
                XLColor.FromHtml("#DBEAFE");
        }
    }







    private void ApplyFormatting(
        IXLWorksheet sheet,
        int lastRow,
        ThemePalette theme)
    {

        var header =
            sheet.Row(HeaderRow);


        header.Style.Font.Bold = true;


        header.Style.Font.FontColor =
            XLColor.White;


        header.Style.Fill.BackgroundColor =
            XLColor.FromHtml(theme.Primary);



        sheet.Range(
            HeaderRow,
            1,
            lastRow,
            15)
            .Style.Border.OutsideBorder =
            XLBorderStyleValues.Thin;



        sheet.Range(
            HeaderRow,
            1,
            lastRow,
            15)
            .Style.Border.InsideBorder =
            XLBorderStyleValues.Thin;




        sheet.Columns(7,10)
            .Style.NumberFormat.Format =
            "0.00%";


        sheet.Columns(6,6)
            .Style.NumberFormat.Format =
            "#,##0";


        sheet.Columns(11,13)
            .Style.NumberFormat.Format =
            "#,##0";


        sheet.Columns(14,15)
            .Style.NumberFormat.Format =
            "0.00";



        sheet.Range(
            $"A{HeaderRow}:O{lastRow}")
            .SetAutoFilter();



        sheet.SheetView
            .FreezeRows(HeaderRow);



        sheet.Columns()
            .AdjustToContents();



        sheet.PageSetup.PageOrientation =
            XLPageOrientation.Landscape;



        sheet.PageSetup.PaperSize =
            XLPaperSize.A4Paper;



        sheet.PageSetup.FitToPages(
            1,
            0);



        sheet.TabColor =
            XLColor.FromHtml(theme.Primary);
    }






    private int FindParentRow(
        IXLWorksheet sheet,
        int row)
    {
        // Temporary fallback.
        // In final revision this will be replaced
        // with row-map dictionary during traversal.

        for(int i = row - 1; i >= FirstDataRow; i--)
        {
            if(sheet.Cell(i,3).GetValue<int>()
                < sheet.Cell(row,3).GetValue<int>())
            {
                return i;
            }
        }

        return FirstDataRow;
    }
}