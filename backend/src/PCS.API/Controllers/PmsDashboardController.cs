using Microsoft.AspNetCore.Mvc;
using PCS.Application.PMS.Interfaces;

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
    public async Task<IActionResult> Get(
        Guid projectId)
    {
        var result =
            await _dashboardService
                .GetProjectDashboardAsync(projectId);


        return Ok(result);
    }
}