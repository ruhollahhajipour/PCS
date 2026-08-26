namespace PCS.Application.Planning.DTOs;

public class CpmResultDto
{
    public Guid ProjectId { get; set; }


    // Total project duration based on CPM calculation
    public int ProjectDuration { get; set; }


    public int TotalActivities { get; set; }


    public int CriticalActivitiesCount { get; set; }


    public List<CpmActivityDto> Activities { get; set; }
        = new();


    // Activity IDs in critical sequence
    public List<string> CriticalPath { get; set; }
    = new();
}



public class CpmActivityDto
{
    public Guid Id { get; set; }


    public string Code { get; set; }
        = string.Empty;


    public string Name { get; set; }
        = string.Empty;


    public int Duration { get; set; }


    // Forward Pass

    public int EarlyStart { get; set; }

    public int EarlyFinish { get; set; }


    // Backward Pass

    public int LateStart { get; set; }

    public int LateFinish { get; set; }


    // Float

    public int TotalFloat { get; set; }

    public int FreeFloat { get; set; }


    public bool IsCritical { get; set; }
}