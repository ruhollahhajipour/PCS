using Microsoft.AspNetCore.Mvc;

using PCS.API.Security;

using PCS.Application.Common.Security;
using PCS.Application.Planning.Interfaces;

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
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Run(
        Guid projectId)
    {
        var result =
            await _scheduler
                .ScheduleProjectAsync(projectId);


        return Ok(result);
    }
}