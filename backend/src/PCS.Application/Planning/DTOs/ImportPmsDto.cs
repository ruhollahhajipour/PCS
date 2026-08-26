namespace PCS.Application.Planning.DTOs;

public class ImportPmsDto
{
    public Guid ProjectId { get; set; }


    public List<ImportWbsDto> WbsNodes { get; set; }
        = new();


    public List<ImportActivityDto> Activities { get; set; }
        = new();
}