using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCS.API.Security;
using PCS.Application.Licensing.DTOs;
using PCS.Application.Licensing.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class LicensingController : ControllerBase
{
    private readonly ILicenseService _licenseService;
    private readonly IProjectAccessGuard _accessGuard;

    public LicensingController(
        ILicenseService licenseService,
        IProjectAccessGuard accessGuard)
    {
        _licenseService = licenseService;
        _accessGuard = accessGuard;
    }

    [HttpGet("status")]
    public async Task<ActionResult<LicenseStatusDto>> GetStatus(
        [FromQuery] Guid companyId,
        CancellationToken cancellationToken)
    {
        if (companyId == Guid.Empty)
            return BadRequest(new { message = "CompanyId is required." });

        if (!await _accessGuard.CanAccessCompanyAsync(
                User, companyId, cancellationToken))
            return Forbid();

        var status = await _licenseService.GetStatusAsync(
            companyId, cancellationToken);

        return Ok(status);
    }

    [HttpGet("access/{moduleId}")]
    public async Task<ActionResult<bool>> HasModuleAccess(
        string moduleId,
        [FromQuery] Guid companyId,
        CancellationToken cancellationToken)
    {
        if (companyId == Guid.Empty)
            return BadRequest(new { message = "CompanyId is required." });

        if (string.IsNullOrWhiteSpace(moduleId))
            return BadRequest(new { message = "ModuleId is required." });

        if (!await _accessGuard.CanAccessCompanyAsync(
                User, companyId, cancellationToken))
            return Forbid();

        var hasAccess = await _licenseService.HasModuleAccessAsync(
            companyId, moduleId, cancellationToken);

        return Ok(hasAccess);
    }
}
