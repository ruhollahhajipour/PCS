using PCS.Application.Common.Interfaces;
using PCS.Application.Companies.DTOs;
using PCS.Application.Companies.Interfaces;
using PCS.Domain.Entities;

namespace PCS.Application.Companies.Services;

public class CompanyService : ICompanyService
{
    private readonly IGenericRepository<Company> _repository;

    public CompanyService(
        IGenericRepository<Company> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CompanyDto>> GetAllAsync()
    {
        var companies =
            await _repository.GetAllAsync();

        return companies.Select(x => new CompanyDto
        {
            Id = x.Id,
            Code = x.Code,
            Name = x.Name,
            NationalId = x.NationalId,
            Address = x.Address,
            Phone = x.Phone,
            Email = x.Email,
            IsActive = x.IsActive
        });
    }

    public async Task<CompanyDto?> GetByIdAsync(Guid id)
    {
        var company =
            await _repository.GetByIdAsync(id);

        if (company is null)
            return null;

        return new CompanyDto
        {
            Id = company.Id,
            Code = company.Code,
            Name = company.Name,
            NationalId = company.NationalId,
            Address = company.Address,
            Phone = company.Phone,
            Email = company.Email,
            IsActive = company.IsActive
        };
    }

    public async Task<Guid> CreateAsync(
        CreateCompanyDto dto)
    {
        var company = new Company
        {
            Code = dto.Code.Trim(),
            Name = dto.Name.Trim(),
            NationalId = dto.NationalId?.Trim(),
            Address = dto.Address?.Trim(),
            Phone = dto.Phone?.Trim(),
            Email = dto.Email?.Trim(),
            IsActive = dto.IsActive
        };

        await _repository.AddAsync(company);
        await _repository.SaveChangesAsync();

        return company.Id;
    }

    public async Task UpdateAsync(
        Guid id,
        CreateCompanyDto dto)
    {
        var company =
            await _repository.GetByIdAsync(id);

        if (company is null)
            throw new Exception("Company not found.");

        company.Code =
            dto.Code.Trim();

        company.Name =
            dto.Name.Trim();

        company.NationalId =
            dto.NationalId?.Trim();

        company.Address =
            dto.Address?.Trim();

        company.Phone =
            dto.Phone?.Trim();

        company.Email =
            dto.Email?.Trim();

        company.IsActive =
            dto.IsActive;

        _repository.Update(company);

        await _repository.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var company =
            await _repository.GetByIdAsync(id);

        if (company is null)
            throw new Exception("Company not found.");

        _repository.Delete(company);

        await _repository.SaveChangesAsync();
    }
}