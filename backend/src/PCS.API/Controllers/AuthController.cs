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


    public AuthController(
        IAuthService authService)
    {
        _authService = authService;
    }


    // ============================================================
    // Login
    // ============================================================

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var response =
            await _authService.LoginAsync(
                request,
                cancellationToken);

        if (response == null)
        {
            return Unauthorized(
                new
                {
                    message =
                        "Invalid username or password."
                });
        }

        return Ok(response);
    }


    // ============================================================
    // Current User
    // ============================================================

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<LoginResponse>> Me(
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

        var response =
            await _authService.GetCurrentUserAsync(
                userId,
                cancellationToken);

        if (response == null)
        {
            return Unauthorized();
        }

        return Ok(response);
    }


    // ============================================================
    // Change Password
    // ============================================================

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordRequest request,
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

        bool changed =
            await _authService.ChangePasswordAsync(
                userId,
                request,
                cancellationToken);

        if (!changed)
        {
            return BadRequest(
                new
                {
                    message =
                        "The current password is incorrect or the new password is invalid."
                });
        }

        return Ok(
            new
            {
                message =
                    "Password changed successfully."
            });
    }
}