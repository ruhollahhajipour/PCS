using Microsoft.AspNetCore.Mvc;
using PCS.API.Security;
using PCS.Application.Common.Security;
using PCS.Application.Planning.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/progress")]
public class PmsProgressController : ControllerBase
{
    private readonly IPmsProgressService _progressService;
    private readonly IProjectAccessGuard _accessGuard;

    public PmsProgressController(
        IPmsProgressService progressService,
        IProjectAccessGuard accessGuard)
    {
        _progressService = progressService;
        _accessGuard = accessGuard;
    }

    [HttpGet("project/{projectId}")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> GetProjectProgress(
        Guid projectId,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessProjectAsync(User, projectId, cancellationToken))
            return NotFound();

        var progress = await _progressService.CalculateProjectProgressAsync(projectId);
        return Ok(new { ProjectId = projectId, Progress = progress });
    }

    [HttpGet("wbs/{wbsId}")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> GetWbsProgress(
        Guid wbsId,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessWbsAsync(User, wbsId, cancellationToken))
            return NotFound();

        var progress = await _progressService.CalculateWbsProgressAsync(wbsId);
        return Ok(new { WbsId = wbsId, Progress = progress });
    }
}
