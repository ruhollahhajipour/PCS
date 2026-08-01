using PCS.Domain.Common;

namespace PCS.Domain.Entities.Cost;

public class CostItem : AuditableEntity
{
    public Guid ProjectId { get; set; }

    public Project Project { get; set; } = null!;


    public string WbsCode { get; set; } = string.Empty;


    public string Description { get; set; } = string.Empty;


    public string Discipline { get; set; } = string.Empty;


    public decimal BudgetAmount { get; set; }


    public decimal CommittedAmount { get; set; }


    public decimal ActualAmount { get; set; }


    public decimal ForecastAmount { get; set; }


    public decimal ProgressPercent { get; set; }


    public string Status { get; set; } = "Normal";
}