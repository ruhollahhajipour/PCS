using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Planning.Export.Excel.Branding;

public sealed class ExcelThemeProvider
{
    private readonly ThemePalette _theme;



    public ExcelThemeProvider()
    {
        _theme =
            ThemePalette.PcsBlue();
    }



    public ExcelThemeProvider(
        ThemePalette theme)
    {
        _theme = theme;
    }



    public ThemePalette GetTheme()
    {
        return _theme;
    }
}