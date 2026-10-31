using Microsoft.AspNetCore.Mvc;
using PCS.API.Security;
using PCS.Application.Common.Security;
using PCS.Application.Planning.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/dashboard")]
public class PmsDashboardController : ControllerBase
{
    private readonly IPmsDashboardService _dashboardService;
    private readonly IProjectAccessGuard _accessGuard;

    public PmsDashboardController(
        IPmsDashboardService dashboardService,
        IProjectAccessGuard accessGuard)
    {
        _dashboardService = dashboardService;
        _accessGuard = accessGuard;
    }

    [HttpGet("{projectId}")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> Get(
        Guid projectId,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessProjectAsync(User, projectId, cancellationToken))
            return NotFound();

        return Ok(await _dashboardService.GetProjectDashboardAsync(projectId));
    }
}
