using ClosedXML.Excel;
using PCS.Application.Planning.Export.Excel.Branding;
using System.IO;

namespace PCS.Application.Planning.Export.Excel.Helpers;

public static class ExcelBrandingHelper
{
    private static readonly string BrandingPath =
        Path.Combine(
            AppContext.BaseDirectory,
            "Resources",
            "Branding");



    // ==========================================
    // Theme
    // ==========================================

    private static ThemePalette CurrentTheme =>
        ThemePalette.PcsBlue();



    // ==========================================
    // Apply Common Page Settings
    // ==========================================

    public static void ApplyPageSetup(
        IXLWorksheet sheet)
    {
        sheet.ShowGridLines = false;


        sheet.PageSetup.PageOrientation =
            XLPageOrientation.Landscape;


        sheet.PageSetup.PaperSize =
            XLPaperSize.A4Paper;


        sheet.PageSetup.PagesWide = 1;


        sheet.PageSetup.Margins.Top = 0.5;
        sheet.PageSetup.Margins.Bottom = 0.5;
        sheet.PageSetup.Margins.Left = 0.4;
        sheet.PageSetup.Margins.Right = 0.4;


        sheet.PageSetup.Footer.Center.AddText(
            "PCS Project Control Suite");


        sheet.PageSetup.Footer.Right.AddText(
            "Page &P / &N");
    }



    // ==========================================
    // Add Platform Logo
    // ==========================================

    public static void AddLogo(
        IXLWorksheet sheet,
        string cell)
    {
        var path =
            Path.Combine(
                BrandingPath,
                "pcs-logo.png");


        if (!File.Exists(path))
            return;


        sheet.AddPicture(path)
            .MoveTo(
                sheet.Cell(cell))
            .WithSize(
                120,
                60);
    }



    // ==========================================
    // Add Watermark
    // ==========================================

    public static void AddWatermark(
        IXLWorksheet sheet)
    {

        var path =
            Path.Combine(
                BrandingPath,
                "pcs-watermark.png");


        if (!File.Exists(path))
            return;


        sheet.AddPicture(path)
            .MoveTo(
                sheet.Cell("D15"))
            .WithSize(
                250,
                250);
    }




    // ==========================================
    // Standard Header
    // ==========================================

    public static void CreateHeader(
        IXLWorksheet sheet,
        string title,
        string range = "A1:H3")
    {
        var theme =
            CurrentTheme;


        sheet.Range(range)
            .Merge();


        var cell =
            sheet.Cell(range.Split(':')[0]);


        cell.Value = title;


        cell.Style.Font.Bold = true;


        cell.Style.Font.FontSize = 20;


        cell.Style.Font.FontColor =
            XLColor.White;


        cell.Style.Fill.BackgroundColor =
            XLColor.FromHtml(
                theme.Dark);


        cell.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;


        cell.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;
    }





    // ==========================================
    // Corporate Section Header
    // ==========================================

    public static void StyleSection(
        IXLRange range)
    {
        var theme =
            CurrentTheme;


        range.Style.Fill.BackgroundColor =
            XLColor.FromHtml(
                theme.Primary);


        range.Style.Font.Bold = true;


        range.Style.Font.FontColor =
            XLColor.White;


        range.Style.Alignment.Horizontal =
            XLAlignmentHorizontalValues.Center;


        range.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;
    }





    // ==========================================
    // Apply Theme Border
    // ==========================================

    public static void ApplyFrame(
        IXLRange range)
    {
        var theme =
            CurrentTheme;


        range.Style.Border.OutsideBorder =
            XLBorderStyleValues.Thick;


        range.Style.Border.OutsideBorderColor =
            XLColor.FromHtml(
                theme.Border);
    }
}