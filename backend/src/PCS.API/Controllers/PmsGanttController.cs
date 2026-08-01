using Microsoft.AspNetCore.Mvc;
using PCS.Application.PMS.Interfaces;

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
    public async Task<IActionResult> Get(
        Guid projectId)
    {
        var result =
            await _ganttService
            .GetGanttAsync(projectId);


        return Ok(result);
    }
}