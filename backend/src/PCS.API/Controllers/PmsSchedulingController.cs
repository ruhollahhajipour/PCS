using Microsoft.AspNetCore.Mvc;
using PCS.Application.PMS.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/scheduling")]
public class PmsSchedulingController : ControllerBase
{
    private readonly ICpmScheduler _scheduler;


    public PmsSchedulingController(
        ICpmScheduler scheduler)
    {
        _scheduler = scheduler;
    }



    [HttpPost("{projectId:guid}/run")]
    public async Task<IActionResult> Run(
        Guid projectId)
    {
        var result =
    await _scheduler.ScheduleProjectAsync(projectId);


return Ok(result);
    }
}