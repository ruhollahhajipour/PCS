using PCS.Application.Common.Interfaces;
using PCS.Application.Companies.DTOs;
using PCS.Application.Companies.Interfaces;
using PCS.Domain.Entities;

namespace PCS.Application.Companies.Services;

public class CompanyService : ICompanyService
{
    private readonly IGenericRepository<Company> _repository;
    private readonly IGenericRepository<CompanyUser> _companyUsers;
    private readonly ICurrentTenant _currentTenant;

    public CompanyService(
        IGenericRepository<Company> repository,
        IGenericRepository<CompanyUser> companyUsers,
        ICurrentTenant currentTenant)
    {
        _repository = repository;
        _companyUsers = companyUsers;
        _currentTenant = currentTenant;
    }

    public async Task<IEnumerable<CompanyDto>> GetAllAsync()
    {
        IEnumerable<Company> companies;

        if (_currentTenant.IsPlatformAdmin)
        {
            companies = await _repository.GetAllAsync();
        }
        else
        {
            if (!_currentTenant.UserId.HasValue)
            {
                return [];
            }

            var memberships = await _companyUsers.FindAsync(x =>
                x.UserId == _currentTenant.UserId.Value &&
                x.IsActive);

            var companyIds = memberships
                .Select(x => x.CompanyId)
                .Distinct()
                .ToArray();

            if (companyIds.Length == 0)
            {
                return [];
            }

            companies = await _repository.FindAsync(x =>
                companyIds.Contains(x.Id) &&
                x.IsActive);
        }

        return companies.Select(MapToDto);
    }

    public async Task<IEnumerable<CompanyDto>> GetByIdsAsync(
        IReadOnlyCollection<Guid> companyIds)
    {
        ArgumentNullException.ThrowIfNull(companyIds);

        if (companyIds.Count == 0)
            return Array.Empty<CompanyDto>();

        var companies = await _repository.FindAsync(
            x => companyIds.Contains(x.Id) && !x.IsDeleted);

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
        if (!await CanAccessCompanyAsync(id))
        {
            return null;
        }

        var company = await _repository.GetByIdAsync(id);

        return company is null ? null : MapToDto(company);
    }

    public async Task<Guid> CreateAsync(CreateCompanyDto dto)
    {
        if (!_currentTenant.IsPlatformAdmin)
        {
            throw new UnauthorizedAccessException(
                "Only a platform administrator can create a company.");
        }

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

    public async Task UpdateAsync(Guid id, CreateCompanyDto dto)
    {
        if (!await CanManageCompanyAsync(id))
        {
            throw new UnauthorizedAccessException(
                "The current user cannot administer this company.");
        }

        var company = await _repository.GetByIdAsync(id);
        if (company is null)
        {
            throw new KeyNotFoundException("Company not found.");
        }

        company.Code = dto.Code.Trim();
        company.Name = dto.Name.Trim();
        company.NationalId = dto.NationalId?.Trim();
        company.Address = dto.Address?.Trim();
        company.Phone = dto.Phone?.Trim();
        company.Email = dto.Email?.Trim();
        company.IsActive = dto.IsActive;

        _repository.Update(company);
        await _repository.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        if (!_currentTenant.IsPlatformAdmin)
        {
            throw new UnauthorizedAccessException(
                "Only a platform administrator can delete a company.");
        }

        var company = await _repository.GetByIdAsync(id);
        if (company is null)
        {
            throw new KeyNotFoundException("Company not found.");
        }

        _repository.Delete(company);
        await _repository.SaveChangesAsync();
    }

    private async Task<bool> CanAccessCompanyAsync(Guid companyId)
    {
        if (_currentTenant.IsPlatformAdmin)
        {
            return true;
        }

        if (!_currentTenant.UserId.HasValue)
        {
            return false;
        }

        return await _companyUsers.ExistsAsync(x =>
            x.UserId == _currentTenant.UserId.Value &&
            x.CompanyId == companyId &&
            x.IsActive);
    }

    private async Task<bool> CanManageCompanyAsync(Guid companyId)
    {
        if (_currentTenant.IsPlatformAdmin)
        {
            return true;
        }

        if (!_currentTenant.UserId.HasValue ||
            _currentTenant.CompanyId != companyId)
        {
            return false;
        }

        return await _companyUsers.ExistsAsync(x =>
            x.UserId == _currentTenant.UserId.Value &&
            x.CompanyId == companyId &&
            x.IsActive &&
            x.IsPrimaryAdmin);
    }

    private static CompanyDto MapToDto(Company company) =>
        new()
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
