using PCS.Application.Projects.DTOs;
using PCS.Domain.Entities;

namespace PCS.Application.Projects.Mappers;

public static class ProjectMapper
{
    public static ProjectDto ToDto(
        this Project project)
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