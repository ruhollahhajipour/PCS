using PCS.Application.Common.Interfaces;
using PCS.Application.Projects.DTOs;
using PCS.Application.Projects.Interfaces;
using PCS.Domain.Entities;

namespace PCS.Application.Projects.Services;

public class ProjectService : IProjectService
{
    private readonly IGenericRepository<Project> _repository;
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IGenericRepository<Plant> _plantRepository;


    public ProjectService(
        IGenericRepository<Project> repository,
        IGenericRepository<Company> companyRepository,
        IGenericRepository<Plant> plantRepository)
    {
        _repository = repository;
        _companyRepository = companyRepository;
        _plantRepository = plantRepository;
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



    public async Task<Guid> CreateAsync(
        CreateProjectDto request)
    {
        ValidateRequest(request);
        await ValidateOrganizationAsync(request.CompanyId, request.PlantId);

        var project = new Project();


        MapToEntity(
            project,
            request);


        await _repository.AddAsync(project);

        await _repository.SaveChangesAsync();


        return project.Id;
    }




    public async Task UpdateAsync(
        Guid id,
        CreateProjectDto request)
    {
        ValidateRequest(request);
        await ValidateOrganizationAsync(request.CompanyId, request.PlantId);

        var project = await _repository.GetByIdAsync(id);


        if (project is null)
            throw new KeyNotFoundException(
                $"Project '{id}' was not found.");



        MapToEntity(
            project,
            request);



        _repository.Update(project);


        await _repository.SaveChangesAsync();
    }





    public async Task DeleteAsync(
        Guid id)
    {
        var project = await _repository.GetByIdAsync(id);


        if (project is null)
            throw new KeyNotFoundException(
                $"Project '{id}' was not found.");



        _repository.Delete(project);


        await _repository.SaveChangesAsync();
    }






    private static void MapToEntity(
        Project project,
        CreateProjectDto dto)
    {

        // ==========================
        // Basic Information
        // ==========================

        project.Code =
            dto.Code.Trim();


        project.Name =
            dto.Name.Trim();


        project.ShortName =
            dto.ShortName?.Trim();


        project.Description =
            dto.Description?.Trim();



        // ==========================
        // Organization
        // ==========================

        project.CompanyId =
            dto.CompanyId;


        project.PlantId =
            dto.PlantId;




        // ==========================
        // Contract
        // ==========================

        project.ContractNo =
            dto.ContractNo?.Trim();


        project.Client =
            dto.Client?.Trim();


        project.Contractor =
            dto.Contractor?.Trim();


        project.Consultant =
            dto.Consultant?.Trim();





        // ==========================
        // Schedule
        // ==========================

        project.StartDate =
            dto.StartDate;


        project.FinishDate =
            dto.EndDate;






        // ==========================
        // Cost
        // ==========================

        project.Budget =
            dto.Budget;


        project.ActualCost =
            dto.ActualCost;


        project.Currency =
            string.IsNullOrWhiteSpace(dto.Currency)
                ? "USD"
                : dto.Currency.Trim();







        // ==========================
        // EVM Performance
        // ==========================

        project.Progress =
            dto.Progress;


        project.SPI =
            dto.SPI == 0
                ? 1
                : dto.SPI;



        project.CPI =
            dto.CPI == 0
                ? 1
                : dto.CPI;







        // ==========================
        // Status
        // ==========================

        project.Status =
            string.IsNullOrWhiteSpace(dto.Status)
                ? "Planning"
                : dto.Status.Trim();



        project.IsActive =
            dto.IsActive;
    }







    private async Task ValidateOrganizationAsync(
        Guid companyId,
        Guid? plantId)
    {
        var company = await _companyRepository.GetByIdAsync(companyId);
        if (company is null || !company.IsActive)
            throw new ArgumentException("The selected company does not exist or is inactive.");

        if (!plantId.HasValue)
            return;

        var plant = await _plantRepository.GetByIdAsync(plantId.Value);
        if (plant is null || !plant.IsActive)
            throw new ArgumentException("The selected plant does not exist or is inactive.");

        if (plant.CompanyId != companyId)
            throw new ArgumentException("The selected plant does not belong to the selected company.");
    }


    private static void ValidateRequest(
        CreateProjectDto dto)
    {

        if (string.IsNullOrWhiteSpace(dto.Code))
            throw new ArgumentException(
                "Project code is required.");



        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ArgumentException(
                "Project name is required.");



        if (dto.CompanyId == Guid.Empty)
            throw new ArgumentException(
                "Company is required.");



        if (dto.EndDate.HasValue &&
            dto.StartDate > dto.EndDate)
        {
            throw new ArgumentException(
                "Start date cannot be after finish date.");
        }



        if (dto.Budget < 0)
            throw new ArgumentException(
                "Budget cannot be negative.");



        if (string.IsNullOrWhiteSpace(dto.Currency))
        {
            dto.Currency = "USD";
        }
    }








    private static ProjectDto MapToDto(
        Project project)
    {

        return new ProjectDto
        {
            Id = project.Id,


            Code = project.Code,


            Name = project.Name,


            ShortName = project.ShortName,


            Description = project.Description,



            CompanyId = project.CompanyId,


            PlantId = project.PlantId,



            ContractNo = project.ContractNo,


            Client = project.Client,


            Contractor = project.Contractor,


            Consultant = project.Consultant,



            StartDate = project.StartDate,


            FinishDate = project.FinishDate,



            Budget = project.Budget,


            ActualCost = project.ActualCost,


            Currency = project.Currency,



            Progress = project.Progress,


            SPI = project.SPI,


            CPI = project.CPI,



            Status = project.Status,


            IsActive = project.IsActive
        };
    }
}