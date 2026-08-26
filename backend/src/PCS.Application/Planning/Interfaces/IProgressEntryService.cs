using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

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
