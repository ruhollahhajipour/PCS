using Microsoft.AspNetCore.Mvc;

using PCS.API.Security;

using PCS.Application.Common.Security;
using PCS.Application.Planning.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/evm")]
public class PmsEvmController : ControllerBase
{
    private readonly IPmsEvmService _evmService;

    public PmsEvmController(IPmsEvmService evmService)
    {
        _evmService = evmService;
    }

    [HttpGet("{projectId}")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> Get(
        Guid projectId,
        [FromQuery] DateTime? reportDate = null)
    {
        if (projectId == Guid.Empty)
            return BadRequest("ProjectId is required.");

        try
        {
            var result = await _evmService.CalculateAsync(
                projectId,
                reportDate ?? DateTime.UtcNow);

            return Ok(result);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                Code = "APPROVED_BASELINE_REQUIRED_FOR_DATA_DATE",
                Message = ex.Message
            });
        }
    }
}
