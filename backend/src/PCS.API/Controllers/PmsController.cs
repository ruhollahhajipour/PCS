using Microsoft.AspNetCore.Mvc;
using PCS.Application.Planning.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/pms")]
public class PmsController : ControllerBase
{
    private static readonly string[] AllowedExtensions =
    {
        ".xlsx",
        ".xlsm",
        ".xltx",
        ".xltm"
    };


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



    // =====================================================
    // IMPORT PMS EXCEL
    // =====================================================

    [HttpPost("import")]
    public async Task<IActionResult> Import(
        IFormFile file,
        [FromQuery] Guid projectId)
    {
        if (projectId == Guid.Empty)
            return BadRequest(
                "ProjectId is required.");


        if (file == null || file.Length == 0)
            return BadRequest(
                "Excel file is empty.");



        var extension =
            Path.GetExtension(file.FileName)
            .ToLowerInvariant();



        if (!AllowedExtensions.Contains(extension))
        {
            return BadRequest(
                $"Extension '{extension}' is not supported.");
        }



        var tempPath =
            Path.Combine(
                Path.GetTempPath(),
                $"{Guid.NewGuid()}{extension}");



        try
        {
            await using (var stream =
                System.IO.File.Create(tempPath))
            {
                await file.CopyToAsync(stream);
            }



            var dto =
                await _excelService.ReadPmsExcelAsync(
                    tempPath);



            dto.ProjectId = projectId;



            await _pmsService.ImportPmsAsync(dto);



            return Ok(new
            {
                Success = true,

                Message =
                    "PMS imported successfully.",

                FileName =
                    file.FileName
            });
        }
        catch(Exception ex)
        {
            return BadRequest(new
            {
                Success = false,

                Message = ex.Message,

                Inner =
                    ex.InnerException?.Message
            });
        }
        finally
        {
            if (System.IO.File.Exists(tempPath))
            {
                System.IO.File.Delete(tempPath);
            }
        }
    }





    // =====================================================
    // EXPORT PMS EXCEL
    // =====================================================

    [HttpGet("export/{projectId}")]
    public async Task<IActionResult> Export(
        Guid projectId)
    {
        if(projectId == Guid.Empty)
            return BadRequest(
                "ProjectId is required.");



        var dto =
            await _pmsService.ExportPmsAsync(
                projectId);



        var file =
            await _excelService.GeneratePmsExcelAsync(
                dto);



        return File(
            file,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "PCS-PMS-Report.xlsx");
    }





    // =====================================================
    // ACTIVITIES
    // =====================================================

    [HttpGet("{projectId}/activities")]
    public async Task<IActionResult> GetActivities(
        Guid projectId)
    {
        if(projectId == Guid.Empty)
            return BadRequest(
                "ProjectId is required.");



        var result =
            await _pmsService.GetActivitiesAsync(
                projectId);



        return Ok(result);
    }





    // =====================================================
    // DOWNLOAD TEMPLATE
    // =====================================================

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