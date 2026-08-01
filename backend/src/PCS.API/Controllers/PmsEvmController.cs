using Microsoft.AspNetCore.Mvc;
using PCS.Application.PMS.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms/evm")]
public class PmsEvmController : ControllerBase
{
    private readonly IPmsEvmService _evmService;


    public PmsEvmController(
        IPmsEvmService evmService)
    {
        _evmService = evmService;
    }



    [HttpGet("{projectId}")]
    public async Task<IActionResult> Get(
        Guid projectId,
        [FromQuery] DateTime reportDate)
    {
        var result =
            await _evmService.CalculateAsync(
                projectId,
                reportDate);


        return Ok(result);
    }
}