namespace PCS.Application.Planning.DTOs;

public class ImportActivityDto
{
    public string Code { get; set; } = string.Empty;
    public string WbsCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int RemainingDuration { get; set; }
    public DateTime? PlannedStart { get; set; }
    public DateTime? PlannedFinish { get; set; }
    public DateTime? ActualStart { get; set; }
    public DateTime? ActualFinish { get; set; }
    public bool ActualStartSpecified { get; set; }
    public bool ActualFinishSpecified { get; set; }
    public decimal Budget { get; set; }
    public decimal Weight { get; set; }
    public decimal Progress { get; set; }
    public string Status { get; set; } = "NotStarted";
    public bool IsMilestone { get; set; }
}