using PCS.Application.Plants.DTOs;

namespace PCS.Application.Plants.Interfaces;

public interface IPlantService
{
    Task<IEnumerable<PlantDto>> GetAllAsync();

    Task<IEnumerable<PlantDto>> GetByCompanyIdAsync(Guid companyId);

    Task<PlantDto?> GetByIdAsync(Guid id);

    Task<Guid> CreateAsync(CreatePlantDto dto);

    Task UpdateAsync(Guid id, CreatePlantDto dto);

    Task DeleteAsync(Guid id);
}
