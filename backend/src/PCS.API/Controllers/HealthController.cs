using Microsoft.AspNetCore.Mvc;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(
            new
            {
                status = "ok",
                application = "PCS",
                version = "1.0",
                timestamp = DateTime.UtcNow
            });
    }
}