using Microsoft.AspNetCore.Mvc;

using PCS.API.Security;

using PCS.Application.Common.Security;
using PCS.Application.Planning.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/gantt")]
public class PmsGanttController : ControllerBase
{
    private readonly IPmsGanttService _ganttService;


    public PmsGanttController(
        IPmsGanttService ganttService)
    {
        _ganttService = ganttService;
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
}