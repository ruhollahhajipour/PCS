using Microsoft.EntityFrameworkCore;

using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Services.Identity;

public sealed class AuthService : IAuthService
{
    private readonly PCSDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(
        PCSDbContext dbContext,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    // ============================================================
    // Login
    // ============================================================

    public async Task<LoginResponse?> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return null;
        }

        string username = request.Username.Trim();

        var user =
            await _dbContext.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .SingleOrDefaultAsync(
                    x =>
                        x.UserName == username &&
                        x.IsActive,
                    cancellationToken);

        if (user == null)
        {
            return null;
        }

        bool passwordValid =
            _passwordHasher.Verify(
                request.Password,
                user.PasswordHash);

        if (!passwordValid)
        {
            return null;
        }

        var response =
            await BuildLoginResponseAsync(
                user,
                cancellationToken);

        user.LastLoginAt =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return response;
    }


    // ============================================================
    // Current User
    // ============================================================

    public async Task<LoginResponse?> GetCurrentUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        if (userId == Guid.Empty)
        {
            return null;
        }

        var user =
            await _dbContext.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .SingleOrDefaultAsync(
                    x =>
                        x.Id == userId &&
                        x.IsActive,
                    cancellationToken);

        if (user == null)
        {
            return null;
        }

        return await BuildLoginResponseAsync(
            user,
            cancellationToken);
    }


    // ============================================================
    // Build Authentication Response
    // ============================================================

    private async Task<LoginResponse> BuildLoginResponseAsync(
        Domain.Entities.Security.User user,
        CancellationToken cancellationToken)
    {
        // ========================================================
        // Active Roles
        // ========================================================

        var activeRoles =
            user.UserRoles
                .Where(x =>
                    x.IsActive &&
                    x.Role.IsActive)
                .Select(x => x.Role)
                .Distinct()
                .ToList();

        var roleIds =
            activeRoles
                .Select(x => x.Id)
                .ToList();

        // ========================================================
        // Permissions
        // ========================================================

        var permissions =
            await _dbContext.RolePermissions
                .AsNoTracking()
                .Where(x =>
                    roleIds.Contains(x.RoleId) &&
                    x.Permission.IsActive)
                .Select(x => x.Permission.Code)
                .Distinct()
                .ToListAsync(
                    cancellationToken);

        // ========================================================
        // Role Codes
        // ========================================================

        var roles =
            activeRoles
                .Select(x => x.Code)
                .Distinct(
                    StringComparer.OrdinalIgnoreCase)
                .ToList();

        // ========================================================
        // JWT
        //
        // For /me we issue a fresh token so that the restored
        // authentication session contains current role/permission
        // information from the database.
        // ========================================================

        string token =
            _jwtService.GenerateToken(
                user.Id,
                user.UserName,
                roles,
                permissions);

        // ========================================================
        // Response
        // ========================================================

        return new LoginResponse
        {
            Token = token,

            UserId =
                user.Id,

            Username =
                user.UserName,

            FullName =
                $"{user.FirstName} {user.LastName}".Trim(),

            Roles =
                roles,

            Permissions =
                permissions,

            MustChangePassword =
                user.MustChangePassword
        };
    }


    // ============================================================
    // Change Password
    // ============================================================

    public async Task<bool> ChangePasswordAsync(
        Guid userId,
        ChangePasswordRequest request,
        CancellationToken cancellationToken = default)
    {
        if (userId == Guid.Empty)
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(
                request.CurrentPassword) ||
            string.IsNullOrWhiteSpace(
                request.NewPassword))
        {
            return false;
        }

        if (request.NewPassword.Length < 8)
        {
            return false;
        }

        if (request.CurrentPassword ==
            request.NewPassword)
        {
            return false;
        }

        var user =
            await _dbContext.Users
                .SingleOrDefaultAsync(
                    x =>
                        x.Id == userId &&
                        x.IsActive,
                    cancellationToken);

        if (user == null)
        {
            return false;
        }

        bool currentPasswordValid =
            _passwordHasher.Verify(
                request.CurrentPassword,
                user.PasswordHash);

        if (!currentPasswordValid)
        {
            return false;
        }

        user.PasswordHash =
            _passwordHasher.Hash(
                request.NewPassword);

        user.MustChangePassword =
            false;

        user.UpdatedAt =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return true;
    }
}