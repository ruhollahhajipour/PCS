using ClosedXML.Excel;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Excel.Branding;
using PCS.Application.Planning.Export.Excel.Helpers;
using System.IO;

namespace PCS.Application.Planning.Export.Excel.Builders;

public sealed class CoverSheetBuilder
{
    public void Build(
        XLWorkbook workbook,
        ExportPmsDto dto)
    {
        var sheet =
            workbook.Worksheets.Add("Cover");


        sheet.ShowGridLines = false;



        var theme =
            ThemePalette.Create(
                dto.ThemePrimaryColor,
                dto.ThemeDarkColor,
                dto.ThemeSecondaryColor,
                dto.ThemeBorderColor);




        // ==========================
        // Page Setup
        // ==========================

        sheet.PageSetup.PageOrientation =
            XLPageOrientation.Landscape;


        sheet.PageSetup.PaperSize =
            XLPaperSize.A4Paper;


        sheet.PageSetup.PagesWide = 1;


        sheet.PageSetup.Margins.Top = 0.3;
        sheet.PageSetup.Margins.Bottom = 0.3;
        sheet.PageSetup.Margins.Left = 0.3;
        sheet.PageSetup.Margins.Right = 0.3;





        // ==========================
        // Layout
        // ==========================

        sheet.Column("A").Width = 3;


        for(char c = 'B'; c <= 'H'; c++)
        {
            sheet.Column(c.ToString()).Width = 18;
        }


        for(int i = 1; i <= 25; i++)
        {
            sheet.Row(i).Height = 24;
        }






        // ==========================
        // Background
        // ==========================

        var backgroundPath =
            ResolveBrandingFile(
                "pcs-cover-background.png");



        if(File.Exists(backgroundPath))
        {
            sheet.AddPicture(backgroundPath)
                .MoveTo(sheet.Cell("A1"))
                .Scale(1.15);
        }






        // ==========================
        // Main Border
        // ==========================

        ExcelBrandingHelper.ApplyFrame(
            sheet.Range("A1:H25"));







        // ==========================
        // Platform Logo
        // ==========================

        var platformLogo =
            string.IsNullOrWhiteSpace(dto.PlatformLogoPath)
                ? "pcs-logo.png"
                : dto.PlatformLogoPath;



        var platformLogoPath =
            ResolveBrandingFile(
                platformLogo);



        if(File.Exists(platformLogoPath))
        {
            sheet.AddPicture(platformLogoPath)
                .MoveTo(sheet.Cell("D2"))
                .WithSize(
                    90,
                    45);
        }






        // ==========================
        // Platform Name
        // ==========================

        sheet.Range("B4:H4")
            .Merge();



        sheet.Cell("B4")
            .Value =
            dto.PlatformName;



        sheet.Cell("B4")
            .Style.Font.Bold = true;



        sheet.Cell("B4")
            .Style.Font.FontSize = 18;



        sheet.Cell("B4")
            .Style.Font.FontColor =
                XLColor.FromHtml(theme.Dark);



        sheet.Cell("B4")
            .Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Center;







        // ==========================
        // Company Logo
        // ==========================

        if(!string.IsNullOrWhiteSpace(dto.CompanyLogoPath))
        {
            var companyLogoPath =
                ResolveBrandingFile(
                    dto.CompanyLogoPath);



            if(File.Exists(companyLogoPath))
            {
                sheet.AddPicture(companyLogoPath)
                    .MoveTo(sheet.Cell("D6"))
                    .WithSize(
                        140,
                        80);
            }
        }







        // ==========================
        // Company Name
        // ==========================

        sheet.Range("B8:H8")
            .Merge();



        sheet.Cell("B8")
            .Value =
            string.IsNullOrWhiteSpace(dto.CompanyDisplayName)
                ? dto.ClientName
                : dto.CompanyDisplayName;



        sheet.Cell("B8")
            .Style.Font.Bold = true;



        sheet.Cell("B8")
            .Style.Font.FontSize = 22;



        sheet.Cell("B8")
            .Style.Font.FontColor =
                XLColor.FromHtml(theme.Primary);



        sheet.Cell("B8")
            .Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Center;






        // ==========================
        // Company Caption
        // ==========================

        sheet.Range("B9:H9")
            .Merge();



        sheet.Cell("B9")
            .Value =
            "Installed & Operated By";



        sheet.Cell("B9")
            .Style.Font.Italic = true;



        sheet.Cell("B9")
            .Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Center;






        // ==========================
        // Report Information
        // ==========================

        sheet.Range("B11:H11")
            .Merge();



        sheet.Cell("B11")
            .Value =
            dto.ReportTitle;



        ExcelBrandingHelper.StyleSection(
            sheet.Range("B11:H11"));





        var info =
            new[]
            {
                ("Project", dto.ProjectName),
                ("Contractor", dto.ContractorName),
                ("Consultant", dto.ConsultantName),
                ("Export Date",
                    dto.ExportDate.ToString("yyyy-MM-dd"))
            };



        int row = 12;



        foreach(var item in info)
        {
            sheet.Cell(row,2)
                .Value =
                item.Item1;



            sheet.Cell(row,3)
                .Value =
                item.Item2;



            sheet.Range(
                row,
                2,
                row,
                7)
                .Style.Border.OutsideBorder =
                    XLBorderStyleValues.Thin;



            sheet.Cell(row,2)
                .Style.Font.Bold = true;


            row++;
        }






        // ==========================
        // Download Platform
        // ==========================

        sheet.Range("B19:H19")
            .Merge();



        sheet.Cell("B19")
            .Value =
            "PCS PLATFORM DOWNLOAD";



        ExcelBrandingHelper.StyleSection(
            sheet.Range("B19:H19"));




        sheet.Range("B20:H22")
            .Merge();



        sheet.Cell("B20")
            .Value =
$@"{dto.InstallationUrl}

Generated automatically by:
{dto.GeneratedBy}";



        sheet.Cell("B20")
            .Style.Alignment.WrapText = true;



        sheet.Cell("B20")
            .Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Center;






        // ==========================
        // Footer
        // ==========================

        sheet.Range("B24:H24")
            .Merge();



        sheet.Cell("B24")
            .Value =
            "Professional Project Control & Cost Management Platform";



        sheet.Cell("B24")
            .Style.Font.Italic = true;



        sheet.Cell("B24")
            .Style.Font.FontColor =
                XLColor.Gray;



        sheet.TabColor =
            XLColor.FromHtml(theme.Primary);
    }







    private static string ResolveBrandingFile(
        string fileName)
    {
        return Path.Combine(
            AppContext.BaseDirectory,
            "Resources",
            "Branding",
            fileName);
    }
}