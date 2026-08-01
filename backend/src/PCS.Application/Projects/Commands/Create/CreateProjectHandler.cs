using PCS.Application.Common.Interfaces;
using PCS.Domain.Entities;

namespace PCS.Application.Projects.Commands.Create;

public sealed class CreateProjectHandler
{
    private readonly IGenericRepository<Project> _repository;


    public CreateProjectHandler(
        IGenericRepository<Project> repository)
    {
        _repository = repository;
    }



    public async Task<Guid> Handle(
        CreateProjectCommand command)
    {
        var request = command.Project;


        var project = new Project
        {
            Code = request.Code,

            Name = request.Name,

            ShortName = request.ShortName,

            Description = request.Description,


            CompanyId = request.CompanyId,

            PlantId = request.PlantId,


            ContractNo = request.ContractNo,

            Client = request.Client,

            Contractor = request.Contractor,

            Consultant = request.Consultant,


            StartDate = request.StartDate,

            FinishDate = request.FinishDate,


            Budget = request.Budget,

            ActualCost = request.ActualCost,

            Currency = request.Currency,


            Progress = request.Progress,

            SPI = request.SPI,

            CPI = request.CPI,


            Status = request.Status,

            IsActive = request.IsActive
        };


        await _repository.AddAsync(project);

        await _repository.SaveChangesAsync();


        return project.Id;
    }
}