using PCS.Application.Common.Interfaces;
using PCS.Application.Plants.DTOs;
using PCS.Application.Plants.Interfaces;
using PCS.Domain.Entities;

namespace PCS.Application.Plants.Services;

public class PlantService : IPlantService
{
    private readonly IGenericRepository<Plant> _repository;

    public PlantService(
        IGenericRepository<Plant> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<PlantDto>> GetAllAsync()
    {
        var plants = await _repository.GetAllAsync();

        return plants
            .Where(x => x.IsActive)
            .Select(MapToDto);
    }

    public async Task<IEnumerable<PlantDto>> GetByCompanyIdsAsync(
        IReadOnlyCollection<Guid> companyIds)
    {
        ArgumentNullException.ThrowIfNull(companyIds);

        if (companyIds.Count == 0)
            return Array.Empty<PlantDto>();

        var plants = await _repository.FindAsync(
            x => companyIds.Contains(x.CompanyId) && x.IsActive && !x.IsDeleted);

        return plants.Select(MapToDto);
    }

    public async Task<IEnumerable<PlantDto>> GetByCompanyIdAsync(
        Guid companyId)
    {
        var plants = await _repository.GetAllAsync();

        return plants
            .Where(x =>
                x.CompanyId == companyId &&
                x.IsActive)
            .Select(MapToDto);
    }

    public async Task<PlantDto?> GetByIdAsync(Guid id)
    {
        var plant = await _repository.GetByIdAsync(id);

        return plant is null
            ? null
            : MapToDto(plant);
    }

    public async Task<Guid> CreateAsync(
        CreatePlantDto dto)
    {
        ValidateRequest(dto);

        var plant = new Plant
        {
            Code = dto.Code.Trim(),
            Name = dto.Name.Trim(),
            ShortName = dto.ShortName?.Trim(),
            Description = dto.Description?.Trim(),
            CompanyId = dto.CompanyId,
            Address = dto.Address?.Trim(),
            Phone = dto.Phone?.Trim(),
            Email = dto.Email?.Trim(),
            IsActive = dto.IsActive
        };

        await _repository.AddAsync(plant);
        await _repository.SaveChangesAsync();

        return plant.Id;
    }

    public async Task UpdateAsync(
        Guid id,
        CreatePlantDto dto)
    {
        ValidateRequest(dto);

        var plant =
            await _repository.GetByIdAsync(id);

        if (plant is null)
        {
            throw new KeyNotFoundException(
                $"Plant '{id}' was not found.");
        }

        plant.Code = dto.Code.Trim();
        plant.Name = dto.Name.Trim();
        plant.ShortName = dto.ShortName?.Trim();
        plant.Description = dto.Description?.Trim();
        plant.CompanyId = dto.CompanyId;
        plant.Address = dto.Address?.Trim();
        plant.Phone = dto.Phone?.Trim();
        plant.Email = dto.Email?.Trim();
        plant.IsActive = dto.IsActive;

        _repository.Update(plant);

        await _repository.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var plant =
            await _repository.GetByIdAsync(id);

        if (plant is null)
        {
            throw new KeyNotFoundException(
                $"Plant '{id}' was not found.");
        }

        _repository.Delete(plant);

        await _repository.SaveChangesAsync();
    }

    private static void ValidateRequest(
        CreatePlantDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Code))
        {
            throw new ArgumentException(
                "Plant code is required.");
        }

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException(
                "Plant name is required.");
        }

        if (dto.CompanyId == Guid.Empty)
        {
            throw new ArgumentException(
                "Company is required.");
        }
    }

    private static PlantDto MapToDto(
        Plant plant)
    {
        return new PlantDto
        {
            Id = plant.Id,
            Code = plant.Code,
            Name = plant.Name,
            ShortName = plant.ShortName,
            Description = plant.Description,
            CompanyId = plant.CompanyId,
            Address = plant.Address,
            Phone = plant.Phone,
            Email = plant.Email,
            IsActive = plant.IsActive
        };
    }
}
