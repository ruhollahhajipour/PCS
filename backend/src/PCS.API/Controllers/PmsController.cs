using Microsoft.AspNetCore.Mvc;

using PCS.API.Security;

using PCS.Application.Common.Security;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Export.Pdf;

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
    private readonly IPmsPdfExporter _pdfExporter;
    private readonly IPmsService _pmsService;
    private readonly IPmsBaselineService _baselineService;
    private readonly IPmsTemplateService _templateService;

    public PmsController(
        IPmsExcelService excelService,
        IPmsPdfExporter pdfExporter,
        IPmsService pmsService,
        IPmsBaselineService baselineService,
        IPmsTemplateService templateService)
    {
        _excelService = excelService;
        _pdfExporter = pdfExporter;
        _pmsService = pmsService;
        _baselineService = baselineService;
        _templateService = templateService;
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
    public async Task<IActionResult> ExportPdf(
        Guid projectId)
    {
        if (projectId == Guid.Empty)
        {
            return BadRequest("ProjectId is required.");
        }

        var dto = await _pmsService.ExportPmsAsync(projectId);
        var file = _pdfExporter.Generate(dto);

        return File(
            file,
            "application/pdf",
            "PCS-PMS-Report.pdf");
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

    [HttpGet("{projectId}/baselines")]
    [Permission(Permissions.ProjectView)]
    public async Task<IActionResult> GetBaselines(Guid projectId)
    {
        if (projectId == Guid.Empty)
            return BadRequest("ProjectId is required.");

        var result = await _baselineService.GetAllAsync(projectId);
        return Ok(result);
    }

    [HttpPost("{projectId}/baselines")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> CreateBaseline(
        Guid projectId,
        [FromBody] CreateProjectBaselineDto request)
    {
        if (projectId == Guid.Empty)
            return BadRequest("ProjectId is required.");

        if (request == null)
            return BadRequest("Baseline request is required.");

        var result = await _baselineService.CreateDraftAsync(
            projectId,
            request,
            User.Identity?.Name);

        return CreatedAtAction(
            nameof(GetBaselines),
            new { projectId },
            result);
    }

    [HttpPost("{projectId}/baselines/{baselineId}/approve")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> ApproveBaseline(
        Guid projectId,
        Guid baselineId)
    {
        if (projectId == Guid.Empty || baselineId == Guid.Empty)
            return BadRequest("ProjectId and BaselineId are required.");

        var result = await _baselineService.ApproveAsync(
            projectId,
            baselineId,
            User.Identity?.Name);

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
