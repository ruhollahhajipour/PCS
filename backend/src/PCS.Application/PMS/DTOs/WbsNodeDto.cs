namespace PCS.Application.PMS.DTOs;

public class WbsNodeDto
{
    public Guid Id { get; set; }


    public string Code { get; set; } = string.Empty;


    public string? ParentCode { get; set; }


    public string Name { get; set; } = string.Empty;


    public int Level { get; set; }


    public decimal Budget { get; set; }


    public decimal Weight { get; set; }


    public decimal Progress { get; set; }


    public List<WbsNodeDto> Children { get; set; }
        = new();
}