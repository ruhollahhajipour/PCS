using PCS.Application.PMS.DTOs;

namespace PCS.Application.PMS.Interfaces;

public interface IPmsDashboardService
{
    Task<PmsDashboardDto> GetProjectDashboardAsync(
        Guid projectId);
}