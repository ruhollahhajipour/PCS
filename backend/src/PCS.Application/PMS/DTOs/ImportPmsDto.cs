namespace PCS.Application.PMS.DTOs;

public class ImportPmsDto
{
    public Guid ProjectId { get; set; }


    public string FileName { get; set; } = string.Empty;


    public List<WbsNodeDto> WbsNodes { get; set; }
        = new List<WbsNodeDto>();


    public List<ActivityDto> Activities { get; set; }
        = new List<ActivityDto>();
}