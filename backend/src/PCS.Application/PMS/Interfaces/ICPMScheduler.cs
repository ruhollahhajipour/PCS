using PCS.Domain.Entities.PMS;
using PCS.Application.PMS.DTOs;

namespace PCS.Application.PMS.Interfaces;

public interface ICpmScheduler
{
    Task<CpmResultDto> ScheduleProjectAsync(Guid projectId);

    Task<List<Activity>> TopologicalSortAsync(Guid projectId);

    Task ForwardPassAsync(Guid projectId);

    Task BackwardPassAsync(Guid projectId);

    Task CalculateFloatAsync(Guid projectId);

    Task DetectCriticalPathAsync(Guid projectId);
}