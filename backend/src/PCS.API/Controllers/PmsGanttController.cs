using Microsoft.AspNetCore.Mvc;

using PCS.API.Security;

using PCS.Application.Common.Security;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/gantt")]
public class PmsGanttController : ControllerBase
{
    private readonly IPmsGanttService _ganttService;
    private readonly IActivityRelationshipService _relationshipService;


    public PmsGanttController(
        IPmsGanttService ganttService,
        IActivityRelationshipService relationshipService)
    {
        _ganttService = ganttService;
        _relationshipService = relationshipService;
    }


    [HttpGet("{projectId:guid}")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> Get(
        Guid projectId)
    {
        var result =
            await _ganttService
                .GetGanttAsync(projectId);


        return Ok(result);
    }

    [HttpPut("{projectId:guid}/activities/{activityId:guid}/relationships")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> ReplaceRelationships(
        Guid projectId,
        Guid activityId,
        [FromBody] ReplaceActivityRelationshipsDto request)
    {
        if (projectId == Guid.Empty || activityId == Guid.Empty)
            return BadRequest(new { Message = "ProjectId and ActivityId are required." });

        if (request is null)
            return BadRequest(new { Message = "Relationship request is required." });

        try
        {
            await _relationshipService.ReplacePredecessorsAsync(
                projectId,
                activityId,
                request);

            return NoContent();
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
}