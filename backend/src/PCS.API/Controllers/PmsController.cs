using Microsoft.AspNetCore.Mvc;

using PCS.API.Security;

using PCS.Application.Common.Security;
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
    private readonly IPmsPdfExporter _pdfExporter;

    public PmsController(
        IPmsExcelService excelService,
        IPmsService pmsService,
        IPmsTemplateService templateService,
        IPmsPdfExporter pdfExporter)
    {
        _excelService = excelService;
        _pmsService = pmsService;
        _templateService = templateService;
        _pdfExporter = pdfExporter;
    }

    [HttpPost("import")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Import(
        IFormFile file,
        [FromQuery] Guid projectId)
    {
        if (projectId == Guid.Empty)
        {
            return BadRequest(
                "ProjectId is required.");
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest(
                "Excel file is empty.");
        }

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
        catch (Exception ex)
        {
            return BadRequest(new
            {
                Success = false,
                Message =
                    ex.Message,
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

    [HttpGet("export/{projectId}")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> Export(
        Guid projectId)
    {
        if (projectId == Guid.Empty)
        {
            return BadRequest(
                "ProjectId is required.");
        }

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

    [HttpGet("export/{projectId}/pdf")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> ExportPdf(Guid projectId)
    {
        if (projectId == Guid.Empty)
            return BadRequest("ProjectId is required.");

        var dto = await _pmsService.ExportPmsAsync(projectId);
        var file = await _pdfExporter.GenerateAsync(dto);
        return File(file, "application/pdf", "PCS-PMS-Report.pdf");
    }

    [HttpGet("{projectId}/activities")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> GetActivities(
        Guid projectId)
    {
        if (projectId == Guid.Empty)
        {
            return BadRequest(
                "ProjectId is required.");
        }

        var result =
            await _pmsService.GetActivitiesAsync(
                projectId);

        return Ok(result);
    }

    [HttpGet("{projectId}/wbs")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> GetWbs(
        Guid projectId)
    {
        if (projectId == Guid.Empty)
        {
            return BadRequest(
                "ProjectId is required.");
        }

        var result =
            await _pmsService.GetWbsTreeAsync(
                projectId);

        return Ok(result);
    }

    [HttpGet("template")]
    [Permission(Permissions.ProjectView)]
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