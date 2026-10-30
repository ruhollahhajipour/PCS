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


    public PmsProgressEntryController(
        IProgressEntryService service)
    {
        _service = service;
    }


    [HttpPost]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Add(
        [FromBody] AddProgressEntryRequest request)
    {
        if (request == null)
            return BadRequest("Progress entry request is required.");

        try
        {
            await _service.AddProgressAsync(
                request.ActivityId,
                request.ProgressDate,
                request.Progress,
                request.ActualCost);

            return Ok(new
            {
                Message = "Progress entry added successfully"
            });
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
        Guid activityId)
    {
        var result =
            await _service.GetActivityProgressAsync(
                activityId);


        return Ok(result);
    }
}


public class AddProgressEntryRequest
{
    public Guid ActivityId { get; set; }

    public DateTime ProgressDate { get; set; }

    public decimal Progress { get; set; }

    public decimal ActualCost { get; set; }
}