using PCS.Application.PMS.DTOs;

namespace PCS.Application.PMS.Interfaces;

public interface IProgressEntryService
{
    Task AddProgressAsync(
        Guid activityId,
        DateTime date,
        decimal progress,
        decimal actualCost);

    Task<List<ProgressEntryDto>> GetActivityProgressAsync(
        Guid activityId);
}