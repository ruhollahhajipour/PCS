using PCS.Application.Planning.Export.Excel.Branding;

namespace PCS.Application.Companies.Interfaces;

public interface ICompanyThemeService
{
    Task<ThemePalette> GetThemeAsync(
        Guid companyId);
}