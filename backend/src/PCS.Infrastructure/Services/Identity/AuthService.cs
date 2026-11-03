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

        var user = await _dbContext.Users
            .IgnoreQueryFilters()
            .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
            .SingleOrDefaultAsync(
                x => x.UserName == username && x.IsActive && !x.IsDeleted,
                cancellationToken);

        if (user is null ||
            !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        if (_passwordHasher.NeedsRehash(user.PasswordHash))
        {
            user.PasswordHash = _passwordHasher.Hash(request.Password);
        }

        bool isPlatformAdmin = IsPlatformAdmin(user);

        Guid? companyId = await _dbContext.CompanyUsers
            .IgnoreQueryFilters()
            .Where(x =>
                x.UserId == user.Id &&
                x.IsActive &&
                !x.IsDeleted &&
                x.Company.IsActive &&
                !x.Company.IsDeleted)
            .OrderBy(x => x.AssignedAt)
            .Select(x => (Guid?)x.CompanyId)
            .FirstOrDefaultAsync(cancellationToken);

        if (!companyId.HasValue && !isPlatformAdmin)
        {
            return null;
        }

        var response = await BuildLoginResponseAsync(
            user,
            companyId,
            cancellationToken);

        user.LastLoginAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return response;
    }

    public async Task<LoginResponse?> GetCurrentUserAsync(
        Guid userId,
        Guid? companyId,
        CancellationToken cancellationToken = default)
    {
        if (userId == Guid.Empty)
        {
            return null;
        }

        var user = await LoadUserAsync(userId, cancellationToken);

        if (user is null ||
            !await CanAccessCompanyAsync(user, companyId, cancellationToken))
        {
            return null;
        }

        return await BuildLoginResponseAsync(
            user,
            companyId,
            cancellationToken);
    }

    public async Task<LoginResponse?> SelectCompanyAsync(
        Guid userId,
        Guid companyId,
        CancellationToken cancellationToken = default)
    {
        if (userId == Guid.Empty || companyId == Guid.Empty)
        {
            return null;
        }

        var user = await LoadUserAsync(userId, cancellationToken);

        if (user is null ||
            !await CanAccessCompanyAsync(user, companyId, cancellationToken))
        {
            return null;
        }

        return await BuildLoginResponseAsync(
            user,
            companyId,
            cancellationToken);
    }

    private Task<Domain.Entities.Security.User?> LoadUserAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return _dbContext.Users
            .IgnoreQueryFilters()
            .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
            .SingleOrDefaultAsync(
                x => x.Id == userId && x.IsActive && !x.IsDeleted,
                cancellationToken);
    }

    private async Task<bool> CanAccessCompanyAsync(
        Domain.Entities.Security.User user,
        Guid? companyId,
        CancellationToken cancellationToken)
    {
        bool isPlatformAdmin = IsPlatformAdmin(user);

        if (!companyId.HasValue)
        {
            return isPlatformAdmin;
        }

        if (isPlatformAdmin)
        {
            return await _dbContext.Companies
                .IgnoreQueryFilters()
                .AnyAsync(
                    x => x.Id == companyId.Value && !x.IsDeleted,
                    cancellationToken);
        }

        bool companyExists = await _dbContext.Companies
            .IgnoreQueryFilters()
            .AnyAsync(
                x => x.Id == companyId.Value && x.IsActive && !x.IsDeleted,
                cancellationToken);

        if (!companyExists)
        {
            return false;
        }

        return await _dbContext.CompanyUsers
            .IgnoreQueryFilters()
            .AnyAsync(
                x =>
                    x.UserId == user.Id &&
                    x.CompanyId == companyId.Value &&
                    x.IsActive &&
                    !x.IsDeleted &&
                    x.Company.IsActive &&
                    !x.Company.IsDeleted,
                cancellationToken);
    }

    private static bool IsPlatformAdmin(
        Domain.Entities.Security.User user)
    {
        return user.UserRoles.Any(x =>
            x.IsActive &&
            x.CompanyId == null &&
            x.Role.IsActive &&
            string.Equals(
                x.Role.Scope,
                "Platform",
                StringComparison.OrdinalIgnoreCase) &&
            string.Equals(
                x.Role.Code,
                "SUPER_ADMIN",
                StringComparison.OrdinalIgnoreCase));
    }

    private async Task<LoginResponse> BuildLoginResponseAsync(
        Domain.Entities.Security.User user,
        Guid? companyId,
        CancellationToken cancellationToken)
    {
        var activeRoles = user.UserRoles
            .Where(x =>
                x.IsActive &&
                x.Role.IsActive &&
                (x.CompanyId == null ||
                 (companyId.HasValue && x.CompanyId == companyId.Value)))
            .Select(x => x.Role)
            .Distinct()
            .ToList();

        var roleIds = activeRoles
            .Select(x => x.Id)
            .ToList();

        var permissions = await _dbContext.RolePermissions
            .IgnoreQueryFilters()
            .AsNoTracking()
            .Where(x =>
                roleIds.Contains(x.RoleId) &&
                x.Permission.IsActive)
            .Select(x => x.Permission.Code)
            .Distinct()
            .ToListAsync(cancellationToken);

        var roles = activeRoles
            .Select(x => x.Code)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        string securityStamp =
            _jwtService.CreateSecurityStamp(user.Id, user.PasswordHash);

        string token = _jwtService.GenerateToken(
            user.Id,
            user.UserName,
            roles,
            permissions,
            companyId,
            IsPlatformAdmin(user),
            securityStamp);

        return new LoginResponse
        {
            Token = token,
            UserId = user.Id,
            ActiveCompanyId = companyId,
            Username = user.UserName,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Roles = roles,
            Permissions = permissions,
            MustChangePassword = user.MustChangePassword
        };
    }

    public async Task<bool> ChangePasswordAsync(
        Guid userId,
        ChangePasswordRequest request,
        CancellationToken cancellationToken = default)
    {
        if (userId == Guid.Empty ||
            string.IsNullOrWhiteSpace(request.CurrentPassword) ||
            string.IsNullOrWhiteSpace(request.NewPassword) ||
            request.NewPassword.Length < 8 ||
            request.CurrentPassword == request.NewPassword)
        {
            return false;
        }

        var user = await _dbContext.Users
            .IgnoreQueryFilters()
            .SingleOrDefaultAsync(
                x => x.Id == userId && x.IsActive && !x.IsDeleted,
                cancellationToken);

        if (user is null ||
            !_passwordHasher.Verify(
                request.CurrentPassword,
                user.PasswordHash))
        {
            return false;
        }

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        user.MustChangePassword = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}