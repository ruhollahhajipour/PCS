using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IPmsGanttService
{
    Task<GanttProjectDto> GetGanttAsync(
        Guid projectId);
}
