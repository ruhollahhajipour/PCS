using PCS.Application.Common.Theme;

namespace PCS.Application.Planning.Export.Excel.Branding;

public sealed class ThemePalette
{
    public string Primary { get; init; }
        = "#2563EB";


    public string Dark { get; init; }
        = "#0F172A";


    public string Secondary { get; init; }
        = "#60A5FA";


    public string Border { get; init; }
        = "#1E3A8A";



    public string Activity { get; init; }
        = "#FFFFFF";





    // ==========================================
    // Default PCS Theme
    // ==========================================

    public static ThemePalette PcsBlue()
    {
        return new ThemePalette
        {
            Primary =
                "#2563EB",

            Dark =
                "#0F172A",

            Secondary =
                "#60A5FA",

            Border =
                "#1E3A8A",

            Activity =
                "#FFFFFF"
        };
    }






    // ==========================================
    // Custom Organization Theme
    // ==========================================

    public static ThemePalette Create(
        string primary,
        string dark,
        string secondary,
        string border)
    {
        return new ThemePalette
        {
            Primary =
                string.IsNullOrWhiteSpace(primary)
                    ? "#2563EB"
                    : primary,


            Dark =
                string.IsNullOrWhiteSpace(dark)
                    ? "#0F172A"
                    : dark,


            Secondary =
                string.IsNullOrWhiteSpace(secondary)
                    ? "#60A5FA"
                    : secondary,


            Border =
                string.IsNullOrWhiteSpace(border)
                    ? "#1E3A8A"
                    : border,


            Activity =
                "#FFFFFF"
        };
    }







    // ==========================================
    // Dynamic WBS Colors
    // ==========================================

    public string GetWbsLevelColor(
        int level,
        int totalLevels)
    {
        if (level <= 0)
            return Activity;

        if (totalLevels <= 0)
            return Primary;



        var colors =
            ThemeColorGenerator.GenerateWbsLevels(
                Primary,
                totalLevels);



        if (colors.Count == 0)
            return Primary;

        if (level > colors.Count)
            return colors[^1];



        return colors[level - 1];
    }
}