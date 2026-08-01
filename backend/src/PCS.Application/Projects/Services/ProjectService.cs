using PCS.Application.Common.Interfaces;
using PCS.Application.Projects.DTOs;
using PCS.Application.Projects.Interfaces;
using PCS.Domain.Entities;

namespace PCS.Application.Projects.Services;

public class ProjectService : IProjectService
{
    private readonly IGenericRepository<Project> _repository;

    public ProjectService(
        IGenericRepository<Project> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllAsync()
    {
        var projects = await _repository.GetAllAsync();

        return projects.Select(MapToDto);
    }

    public async Task<ProjectDto?> GetByIdAsync(Guid id)
    {
        var project = await _repository.GetByIdAsync(id);

        return project is null
            ? null
            : MapToDto(project);
    }

    public async Task<Guid> CreateAsync(CreateProjectDto request)
    {
        ValidateRequest(request);

        var project = new Project();

        MapToEntity(project, request);

        project.IsActive = true;

        await _repository.AddAsync(project);
        await _repository.SaveChangesAsync();

        return project.Id;
    }

    public async Task UpdateAsync(
        Guid id,
        CreateProjectDto request)
    {
        ValidateRequest(request);

        var project = await _repository.GetByIdAsync(id);

        if (project is null)
            throw new KeyNotFoundException($"Project '{id}' was not found.");

        MapToEntity(project, request);

        _repository.Update(project);

        await _repository.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var project = await _repository.GetByIdAsync(id);

        if (project is null)
            throw new KeyNotFoundException($"Project '{id}' was not found.");

        _repository.Delete(project);

        await _repository.SaveChangesAsync();
    }

    private static void MapToEntity(
        Project project,
        CreateProjectDto dto)
    {
        project.Code = dto.Code.Trim();

        project.Name = dto.Name.Trim();

        project.ShortName = dto.ShortName?.Trim();

        project.Description = dto.Description?.Trim();

        project.CompanyId = dto.CompanyId;

        project.ContractNo = dto.ContractNo?.Trim();

        project.Client = dto.Client?.Trim();

        project.Contractor = dto.Contractor?.Trim();

        project.Consultant = dto.Consultant?.Trim();

        project.StartDate = dto.StartDate;

        project.FinishDate = dto.EndDate;

        project.Budget = dto.Budget;

        project.Currency = dto.Currency.Trim();
    }

    private static void ValidateRequest(
        CreateProjectDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Code))
            throw new ArgumentException("Project code is required.");

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ArgumentException("Project name is required.");

        if (dto.CompanyId == Guid.Empty)
            throw new ArgumentException("Company is required.");

        if (dto.StartDate > dto.EndDate)
            throw new ArgumentException("Start date cannot be after finish date.");

        if (dto.Budget < 0)
            throw new ArgumentException("Budget cannot be negative.");

        if (string.IsNullOrWhiteSpace(dto.Currency))
            throw new ArgumentException("Currency is required.");
    }

    private static ProjectDto MapToDto(Project project)
    {
        return new ProjectDto
        {
            Id = project.Id,

            Code = project.Code,

            Name = project.Name,

            ShortName = project.ShortName,

            Description = project.Description,

            CompanyId = project.CompanyId,

            ContractNo = project.ContractNo,

            Client = project.Client,

            Contractor = project.Contractor,

            Consultant = project.Consultant,

            StartDate = project.StartDate,

            FinishDate = project.FinishDate,

            Budget = project.Budget,

            Currency = project.Currency,

            IsActive = project.IsActive
        };
    }
}