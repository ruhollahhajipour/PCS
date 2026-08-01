using PCS.Application.Projects.DTOs;
using PCS.Application.Projects.Interfaces;

namespace PCS.Application.Projects.Queries.GetAll;

public sealed class GetProjectsHandler
{
    private readonly IProjectRepository _repository;

    public GetProjectsHandler(
        IProjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ProjectDto>> Handle(
        GetProjectsQuery query)
    {
        var projects =
            await _repository.GetAllAsync();

        return projects
            .Select(x => new ProjectDto
            {
                Id = x.Id,

                Code = x.Code,

                Name = x.Name,

                ShortName = x.ShortName,

                Description = x.Description,

                CompanyId = x.CompanyId,

                ContractNo = x.ContractNo,

                Client = x.Client,

                Contractor = x.Contractor,

                Consultant = x.Consultant,

                StartDate = x.StartDate,

                FinishDate = x.FinishDate,

                Budget = x.Budget,

                Currency = x.Currency,

                IsActive = x.IsActive

            })
            .ToList();
    }
}