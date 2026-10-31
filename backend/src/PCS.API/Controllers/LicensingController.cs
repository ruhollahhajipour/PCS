using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using PCS.Application.Licensing.DTOs;
using PCS.Application.Licensing.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class LicensingController : ControllerBase
{
    private readonly ILicenseService _licenseService;

    public LicensingController(
        ILicenseService licenseService)
    {
        _licenseService = licenseService;
    }


    // ============================================================
    // License Status
    // GET /api/licensing/status?companyId={guid}
    // ============================================================

    [HttpGet("status")]
    public async Task<ActionResult<LicenseStatusDto>> GetStatus(
        [FromQuery] Guid companyId,
        CancellationToken cancellationToken)
    {
        string? userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(
                userIdClaim,
                out Guid userId))
        {
            return Unauthorized();
        }


        if (companyId == Guid.Empty)
        {
            return BadRequest(new
            {
                message =
                    "CompanyId is required."
            });
        }


        bool isMember =
            await _licenseService
                .IsUserCompanyMemberAsync(
                    userId,
                    companyId,
                    cancellationToken);


        if (!isMember)
        {
            return Forbid();
        }


        var status =
            await _licenseService.GetStatusAsync(
                companyId,
                cancellationToken);


        return Ok(status);
    }


    // ============================================================
    // Module Access
    // GET /api/licensing/access/{moduleId}?companyId={guid}
    // ============================================================

    [HttpGet("access/{moduleId}")]
    public async Task<ActionResult<bool>> HasModuleAccess(
        string moduleId,
        [FromQuery] Guid companyId,
        CancellationToken cancellationToken)
    {
        string? userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(
                userIdClaim,
                out Guid userId))
        {
            return Unauthorized();
        }


        if (companyId == Guid.Empty)
        {
            return BadRequest(new
            {
                message =
                    "CompanyId is required."
            });
        }


        if (string.IsNullOrWhiteSpace(moduleId))
        {
            return BadRequest(new
            {
                message =
                    "ModuleId is required."
            });
        }


        bool isMember =
            await _licenseService
                .IsUserCompanyMemberAsync(
                    userId,
                    companyId,
                    cancellationToken);


        if (!isMember)
        {
            return Forbid();
        }


        bool hasAccess =
            await _licenseService.HasModuleAccessAsync(
                companyId,
                moduleId,
                cancellationToken);


        return Ok(hasAccess);
    }
}