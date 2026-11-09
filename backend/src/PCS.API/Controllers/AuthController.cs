using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IRefreshTokenService _refreshTokens;

    public AuthController(
        IAuthService authService,
        IRefreshTokenService refreshTokens)
    {
        _authService = authService;
        _refreshTokens = refreshTokens;
    }

    [AllowAnonymous]
    [EnableRateLimiting("login")]
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

        var refresh = await _refreshTokens.IssueAsync(
            response.UserId,
            response.ActiveCompanyId,
            cancellationToken);

        response.RefreshToken = refresh.Token;

        return Ok(response);
    }

    [AllowAnonymous]
    [EnableRateLimiting("login")]
    [HttpPost("refresh")]
    public async Task<ActionResult<LoginResponse>> Refresh(
        [FromBody] RefreshRequest request,
        CancellationToken cancellationToken)
    {
        var rotation = await _refreshTokens.RotateAsync(
            request.RefreshToken,
            request.CompanyId,
            cancellationToken);

        if (rotation is null)
        {
            return Unauthorized(new { message = "The session is no longer valid." });
        }

        var response = await _authService.GetCurrentUserAsync(
            rotation.UserId,
            rotation.CompanyId,
            cancellationToken);

        if (response is null)
        {
            // The user was deactivated or lost access to the company.
            await _refreshTokens.RevokeFamilyAsync(
                rotation.FamilyId,
                "access_lost",
                cancellationToken);

            return Unauthorized(new { message = "The session is no longer valid." });
        }

        response.RefreshToken = rotation.Token;

        return Ok(response);
    }

    [AllowAnonymous]
    [EnableRateLimiting("login")]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        [FromBody] LogoutRequest? request,
        CancellationToken cancellationToken)
    {
        // The refresh token is the credential, so logout works with an expired
        // access token and never reveals whether the token existed.
        if (!string.IsNullOrWhiteSpace(request?.RefreshToken))
        {
            await _refreshTokens.RevokeByTokenAsync(
                request.RefreshToken,
                cancellationToken);
        }

        return NoContent();
    }

    [Authorize]
    [HttpGet("sessions")]
    public async Task<ActionResult<IReadOnlyList<SessionDto>>> Sessions(
        CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out Guid userId))
        {
            return Unauthorized();
        }

        return Ok(await _refreshTokens.ListSessionsAsync(userId, cancellationToken));
    }

    [Authorize]
    [HttpDelete("sessions/{sessionId:guid}")]
    public async Task<IActionResult> RevokeSession(
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out Guid userId))
        {
            return Unauthorized();
        }

        bool revoked = await _refreshTokens.RevokeSessionAsync(
            userId,
            sessionId,
            cancellationToken);

        return revoked ? NoContent() : NotFound();
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

        // A new password ends every session; this device gets a fresh one so
        // the user is not signed out of the window they just used.
        await _refreshTokens.RevokeAllForUserAsync(
            userId,
            "password_changed",
            cancellationToken);

        var refresh = await _refreshTokens.IssueAsync(
            userId,
            TryGetCompanyId(),
            cancellationToken);

        return Ok(new
        {
            message = "Password changed successfully.",
            refreshToken = refresh.Token
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
