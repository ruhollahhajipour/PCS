using Microsoft.AspNetCore.Mvc;
using PCS.Application.PMS.Interfaces;

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
    public async Task<IActionResult> Add(
        [FromBody] AddProgressEntryRequest request)
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




    [HttpGet("activity/{activityId}")]
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