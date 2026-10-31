using PCS.Application.Common.Interfaces;
using PCS.Application.Companies.Interfaces;
using PCS.Application.Planning.Export.Excel.Branding;
using PCS.Domain.Entities;

namespace PCS.Application.Companies.Services;

public sealed class CompanyThemeService
    : ICompanyThemeService
{
    private readonly IGenericRepository<Company> _repository;


    public CompanyThemeService(
        IGenericRepository<Company> repository)
    {
        _repository = repository;
    }




    public async Task<ThemePalette> GetThemeAsync(
        Guid companyId)
    {
        var company =
            await _repository.GetByIdAsync(companyId);



        if (company is null)
        {
            return ThemePalette.PcsBlue();
        }



        if (company.Theme is null ||
            !company.Theme.IsCustomTheme)
        {
            return ThemePalette.PcsBlue();
        }



        return ThemePalette.Create(
            company.Theme.PrimaryColor,
            company.Theme.DarkColor,
            company.Theme.SecondaryColor,
            company.Theme.BorderColor);
    }
}