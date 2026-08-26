using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IPmsDashboardService
{
    Task<PmsDashboardDto> GetProjectDashboardAsync(
        Guid projectId);
}
