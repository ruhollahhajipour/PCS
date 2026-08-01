namespace PCS.Application.PMS.DTOs;

public class CpmResultDto
{
    public Guid ProjectId { get; set; }

    public int ProjectDuration { get; set; }


    public int TotalActivities { get; set; }


    public int CriticalActivitiesCount { get; set; }


    public List<CpmActivityDto> Activities { get; set; }
        = new();


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


    public int EarlyStart { get; set; }


    public int EarlyFinish { get; set; }


    public int LateStart { get; set; }


    public int LateFinish { get; set; }


    public int TotalFloat { get; set; }


    public int FreeFloat { get; set; }


    public bool IsCritical { get; set; }
}