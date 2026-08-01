using Microsoft.AspNetCore.Mvc;
using PCS.Application.PMS.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/progress")]
public class PmsProgressController : ControllerBase
{
    private readonly IPmsProgressService _progressService;


    public PmsProgressController(
        IPmsProgressService progressService)
    {
        _progressService = progressService;
    }



    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetProjectProgress(
        Guid projectId)
    {
        var progress =
            await _progressService
                .CalculateProjectProgressAsync(projectId);


        return Ok(new
        {
            ProjectId = projectId,
            Progress = progress
        });
    }





    [HttpGet("wbs/{wbsId}")]
    public async Task<IActionResult> GetWbsProgress(
        Guid wbsId)
    {
        var progress =
            await _progressService
                .CalculateWbsProgressAsync(wbsId);


        return Ok(new
        {
            WbsId = wbsId,
            Progress = progress
        });
    }
}