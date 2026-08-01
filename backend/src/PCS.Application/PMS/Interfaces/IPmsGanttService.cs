using PCS.Application.PMS.DTOs;

namespace PCS.Application.PMS.Interfaces;

public interface IPmsGanttService
{
    Task<GanttProjectDto> GetGanttAsync(
        Guid projectId);
}