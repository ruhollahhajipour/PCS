using PCS.Domain.Entities.Planning;
using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface ICpmScheduler
{
    Task<CpmResultDto> ScheduleProjectAsync(Guid projectId);

    Task<List<Activity>> TopologicalSortAsync(Guid projectId);

    Task ForwardPassAsync(Guid projectId);

    Task BackwardPassAsync(Guid projectId);

    Task CalculateFloatAsync(Guid projectId);

    Task DetectCriticalPathAsync(Guid projectId);
}
