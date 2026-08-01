namespace PCS.Application.PMS.DTOs;

public class ExportPmsDto
{
    public Guid ProjectId { get; set; }


    public string ProjectName { get; set; } = string.Empty;


    public DateTime ExportDate { get; set; } = DateTime.UtcNow;



    public List<WbsNodeDto> WbsNodes { get; set; }
        = new List<WbsNodeDto>();


    public List<ActivityDto> Activities { get; set; }
        = new List<ActivityDto>();



    // Summary

    public decimal TotalBudget { get; set; }


    public decimal OverallProgress { get; set; }


    public int TotalActivities { get; set; }


    public int TotalWbsNodes { get; set; }



    // EVM Summary

    public decimal PlannedValue { get; set; }


    public decimal EarnedValue { get; set; }


    public decimal ActualCost { get; set; }


    public decimal CostVariance { get; set; }


    public decimal ScheduleVariance { get; set; }


    public decimal CPI { get; set; }


    public decimal SPI { get; set; }
}