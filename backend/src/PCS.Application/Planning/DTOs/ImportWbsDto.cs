namespace PCS.Application.Planning.DTOs;

public class ImportWbsDto
{
    public string Code { get; set; }
        = string.Empty;


    public string? ParentCode { get; set; }


    public string Name { get; set; }
        = string.Empty;


    public int Level { get; set; }


    public decimal Budget { get; set; }


    /// <summary>
    /// Weight Factor نسبت به Parent WBS
    /// </summary>
    public decimal WeightFactor { get; set; }


    /// <summary>
    /// Weight Value نسبت به کل پروژه
    /// </summary>
    public decimal WeightValue { get; set; }


    public decimal Progress { get; set; }
}