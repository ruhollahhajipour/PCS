namespace PCS.Application.PMS.DTOs;

public class ProgressEntryDto
{
    public Guid Id { get; set; }

    public Guid ActivityId { get; set; }

    public DateTime ProgressDate { get; set; }

    public decimal Progress { get; set; }

    public decimal ActualCost { get; set; }

    public decimal EarnedValue { get; set; }
}