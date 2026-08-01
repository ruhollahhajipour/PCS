using PCS.Application.Projects.DTOs;

namespace PCS.Application.Projects.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync();

    Task<ProjectDto?> GetByIdAsync(Guid id);

    Task<Guid> CreateAsync(
        CreateProjectDto request);

    Task UpdateAsync(
        Guid id,
        CreateProjectDto request);

    Task DeleteAsync(Guid id);
}