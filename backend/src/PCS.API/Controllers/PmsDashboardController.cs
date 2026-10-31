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


    public PmsDashboardController(
        IPmsDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }


    [HttpGet("{projectId}")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> Get(
        Guid projectId)
    {
        var result =
            await _dashboardService
                .GetProjectDashboardAsync(projectId);


        return Ok(result);
    }
}