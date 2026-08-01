using System;

namespace PCS.Application.Projects.DTOs;

public sealed class ProjectDto
{
    public Guid Id { get; set; }

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? ShortName { get; set; }

    public string? Description { get; set; }

    public Guid CompanyId { get; set; }

    public Guid? PlantId { get; set; }

    public string? ContractNo { get; set; }

    public string? Client { get; set; }

    public string? Contractor { get; set; }

    public string? Consultant { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? FinishDate { get; set; }

    public decimal Budget { get; set; }

    public decimal ActualCost { get; set; }

    public string Currency { get; set; } = string.Empty;

    public decimal Progress { get; set; }

    public decimal SPI { get; set; }

    public decimal CPI { get; set; }

    public string Status { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}