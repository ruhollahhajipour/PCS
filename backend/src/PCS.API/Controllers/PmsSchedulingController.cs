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
    private readonly IProjectAccessGuard _accessGuard;

    public PmsSchedulingController(
        ICpmScheduler scheduler,
        IProjectAccessGuard accessGuard)
    {
        _scheduler = scheduler;
        _accessGuard = accessGuard;
    }

    [HttpPost("{projectId:guid}/run")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Run(
        Guid projectId,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessProjectAsync(User, projectId, cancellationToken))
            return NotFound();

        return Ok(await _scheduler.ScheduleProjectAsync(projectId));
    }
}
