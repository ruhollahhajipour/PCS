using PCS.Domain.Entities;

namespace PCS.Application.Projects.Interfaces;

public interface IProjectRepository
{
    Task<List<Project>> GetAllAsync();

    Task<Project?> GetByIdAsync(Guid id);

    Task AddAsync(Project project);

    void Update(Project project);

    void Delete(Project project);

    Task<bool> ExistsAsync(string code);

    Task<List<Project>> GetActiveAsync();

    Task<List<Project>> GetByCompanyAsync(Guid companyId);

    Task SaveChangesAsync();
}