using Microsoft.AspNetCore.Mvc;
using PCS.API.Security;
using PCS.Application.Common.Security;
using PCS.Application.Planning.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/progress-entry")]
public class PmsProgressEntryController : ControllerBase
{
    private readonly IProgressEntryService _service;
    private readonly IProjectAccessGuard _accessGuard;

    public PmsProgressEntryController(
        IProgressEntryService service,
        IProjectAccessGuard accessGuard)
    {
        _service = service;
        _accessGuard = accessGuard;
    }

    [HttpPost]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Add(
        [FromBody] AddProgressEntryRequest request,
        CancellationToken cancellationToken)
    {
        if (request is null)
            return BadRequest("Progress entry request is required.");

        if (!await _accessGuard.CanAccessActivityAsync(
                User, request.ActivityId, cancellationToken))
            return NotFound();

        try
        {
            await _service.AddProgressAsync(
                request.ActivityId,
                request.ProgressDate,
                request.Progress,
                request.ActualCost);

            return Ok(new { Message = "Progress entry added successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
    }

    [HttpGet("activity/{activityId}")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> Get(
        Guid activityId,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessActivityAsync(User, activityId, cancellationToken))
            return NotFound();

        return Ok(await _service.GetActivityProgressAsync(activityId));
    }
}

public class AddProgressEntryRequest
{
    public Guid ActivityId { get; set; }
    public DateTime ProgressDate { get; set; }
    public decimal Progress { get; set; }

    /// <summary>
    /// Actual cost incurred during this reporting period (not cumulative project-to-date AC).
    /// </summary>
    public decimal ActualCost { get; set; }
}
