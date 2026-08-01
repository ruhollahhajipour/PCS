using PCS.Application.Companies.DTOs;

namespace PCS.Application.Companies.Interfaces;

public interface ICompanyService
{
    Task<IEnumerable<CompanyDto>> GetAllAsync();

    Task<CompanyDto?> GetByIdAsync(Guid id);

    Task<Guid> CreateAsync(CreateCompanyDto dto);

    Task UpdateAsync(Guid id, CreateCompanyDto dto);

    Task DeleteAsync(Guid id);
}