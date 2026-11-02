using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.LoginAsync(
            request,
            cancellationToken);

        if (response is null)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password, or no active company membership."
            });
        }

        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<LoginResponse>> Me(
        CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out Guid userId))
        {
            return Unauthorized();
        }

        Guid? companyId = TryGetCompanyId();

        var response = await _authService.GetCurrentUserAsync(
            userId,
            companyId,
            cancellationToken);

        return response is null
            ? Unauthorized()
            : Ok(response);
    }

    [Authorize]
    [HttpPost("select-company")]
    public async Task<ActionResult<LoginResponse>> SelectCompany(
        [FromBody] SelectCompanyRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out Guid userId) ||
            request.CompanyId == Guid.Empty)
        {
            return Unauthorized();
        }

        var response = await _authService.SelectCompanyAsync(
            userId,
            request.CompanyId,
            cancellationToken);

        return response is null
            ? Forbid()
            : Ok(response);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out Guid userId))
        {
            return Unauthorized();
        }

        bool changed = await _authService.ChangePasswordAsync(
            userId,
            request,
            cancellationToken);

        if (!changed)
        {
            return BadRequest(new
            {
                message = "The current password is incorrect or the new password is invalid."
            });
        }

        return Ok(new
        {
            message = "Password changed successfully."
        });
    }

    private bool TryGetUserId(out Guid userId) =>
        Guid.TryParse(
            User.FindFirstValue(ClaimTypes.NameIdentifier),
            out userId);

    private Guid? TryGetCompanyId() =>
        Guid.TryParse(
            User.FindFirstValue("company_id"),
            out Guid companyId)
            ? companyId
            : null;
}
