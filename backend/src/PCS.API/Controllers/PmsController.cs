using Microsoft.AspNetCore.Mvc;
using PCS.Application.PMS.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms")]
public class PmsController : ControllerBase
{
    private readonly IPmsExcelService _excelService;
    private readonly IPmsService _pmsService;
    private readonly IPmsTemplateService _templateService;


    public PmsController(
        IPmsExcelService excelService,
        IPmsService pmsService,
        IPmsTemplateService templateService)
    {
        _excelService = excelService;
        _pmsService = pmsService;
        _templateService = templateService;
    }



    [HttpPost("import")]
    public async Task<IActionResult> Import(
        IFormFile file,
        [FromQuery] Guid projectId)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is empty");


        var tempPath = Path.GetTempFileName();


        using (var stream = System.IO.File.Create(tempPath))
        {
            await file.CopyToAsync(stream);
        }


        var dto =
            await _excelService.ReadPmsExcelAsync(tempPath);


        dto.ProjectId = projectId;


        await _pmsService.ImportPmsAsync(dto);


        System.IO.File.Delete(tempPath);


        return Ok(new
        {
            Message = "PMS imported successfully"
        });
    }




    [HttpGet("export/{projectId}")]
    public async Task<IActionResult> Export(
        Guid projectId)
    {
        var dto =
            await _pmsService.ExportPmsAsync(projectId);


        var file =
            await _excelService.GeneratePmsExcelAsync(dto);


        return File(
            file,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "PMS_Report.xlsx");
    }


[HttpGet("{projectId}/activities")]
public async Task<IActionResult> GetActivities(
    Guid projectId)
{
    var result =
        await _pmsService.GetActivitiesAsync(projectId);

    return Ok(result);
}


    [HttpGet("template")]
    public IActionResult DownloadTemplate()
    {
        var file =
            _templateService.GenerateTemplate();


        return File(
            file,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "PCS-PMS-Import-Template.xlsx");
    }
}