namespace PCS.Application.PMS.DTOs;

public class ActivityDto
{
    public Guid Id { get; set; }


    public string Code { get; set; } = string.Empty;



    // WBS Code
    public string WbsCode { get; set; } = string.Empty;



    public string Name { get; set; } = string.Empty;



    // Duration in days
    public int Duration { get; set; }



    public DateTime? PlannedStart { get; set; }


    public DateTime? PlannedFinish { get; set; }



    public decimal Budget { get; set; }


    public decimal Weight { get; set; }



    public decimal Progress { get; set; }



    public bool IsMilestone { get; set; }



    // Actual progress tracking

    public decimal ActualCost { get; set; }


    public decimal EarnedValue { get; set; }



    // Display information

    public string? WbsName { get; set; }
}