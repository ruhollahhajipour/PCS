namespace PCS.Application.PMS.DTOs;

public class PmsDashboardDto
{
    public Guid ProjectId { get; set; }

    public string ProjectName { get; set; } = string.Empty;


    public decimal Progress { get; set; }


    public decimal Budget { get; set; }

    public decimal ActualCost { get; set; }


    public decimal EarnedValue { get; set; }


    public decimal CPI { get; set; }

    public decimal SPI { get; set; }


    public int TotalActivities { get; set; }

    public int CompletedActivities { get; set; }
}