namespace PCS.Application.Planning.DTOs;

public class EvmResultDto
{
    public Guid ProjectId { get; set; }

    public DateTime ReportDate { get; set; }

    public Guid BaselineId { get; set; }

    public string BaselineName { get; set; } = string.Empty;

    public int BaselineVersion { get; set; }

    public int BaselineActivityCount { get; set; }

    public decimal BaselineBudget { get; set; }

    public string? DataQualityNote { get; set; }

    public decimal PlannedValue { get; set; }

    public decimal EarnedValue { get; set; }

    public decimal ActualCost { get; set; }

    public decimal ScheduleVariance { get; set; }

    public decimal CostVariance { get; set; }

    public decimal SPI { get; set; }

    public decimal CPI { get; set; }
}
