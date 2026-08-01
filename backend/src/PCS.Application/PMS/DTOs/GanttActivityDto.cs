namespace PCS.Application.PMS.DTOs;

public class GanttActivityDto
{
    public Guid Id { get; set; }

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;


    public int Start { get; set; }

    public int Finish { get; set; }


    public int Duration { get; set; }


    public decimal Progress { get; set; }


    public int Float { get; set; }


    public bool IsCritical { get; set; }


    public bool IsMilestone { get; set; }
}



public class GanttProjectDto
{
    public Guid ProjectId { get; set; }

    public int Duration { get; set; }


    public List<GanttActivityDto> Activities { get; set; }
        = new();
}