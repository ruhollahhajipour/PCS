using Microsoft.EntityFrameworkCore;

using PCS.Application.Common.Auditing;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;
using PCS.Application.Identity.DTOs;
using PCS.Application.Identity.Interfaces;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Services.Identity;

public sealed class AuthService : IAuthService
{
    private readonly PCSDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;
    private readonly IAuditService? _auditService;
    private readonly LockoutOptions _lockout;
    private readonly TimeProvider _time;

    public AuthService(
        PCSDbContext dbContext,
        IPasswordHasher passwordHasher,
        IJwtService jwtService,
        IAuditService? auditService = null,
        LockoutOptions? lockoutOptions = null,
        TimeProvider? timeProvider = null)
    {
        _lockout = lockoutOptions ?? new LockoutOptions();
        _time = timeProvider ?? TimeProvider.System;
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _auditService = auditService;
    }

    // Security events are recorded without passwords, tokens or other secrets.
    private Task RecordSecurityEventAsync(
        string action,
        Guid? userId,
        string? username,
        Guid? companyId,
        string? details,
        CancellationToken cancellationToken)
    {
        if (_auditService is null)
        {
            return Task.CompletedTask;
        }

        return _auditService.RecordAsync(
            new AuditEvent(
                AuditModules.Security,
                "User",
                userId?.ToString() ?? "unknown",
                action,
                userId,
                username,
                companyId,
                details),
            cancellationToken);
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

        DateTime now = _time.GetUtcNow().UtcDateTime;

        if (user is not null &&
            user.LockoutEnd.HasValue &&
            user.LockoutEnd.Value > now)
        {
            // The password is not even checked while the account is locked, so
            // a correct guess during the lockout window gains nothing. The
            // caller sees the same result as for any other failed login.
            await RecordSecurityEventAsync(
                AuditActions.LoginFailed,
                user.Id,
                username,
                null,
                "locked_out",
                cancellationToken);

            return null;
        }

        if (user is null ||
            !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            bool locked = user is not null &&
                await RegisterFailedAttemptAsync(user, now, cancellationToken);

            await RecordSecurityEventAsync(
                AuditActions.LoginFailed,
                user?.Id,
                username,
                null,
                "invalid_credentials",
                cancellationToken);

            if (locked)
            {
                await RecordSecurityEventAsync(
                    AuditActions.AccountLocked,
                    user!.Id,
                    username,
                    null,
                    $"locked_for_{_lockout.LockoutMinutes}_minutes",
                    cancellationToken);
            }

            return null;
        }

        user.FailedLoginCount = 0;
        user.LockoutEnd = null;

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
            await RecordSecurityEventAsync(
                AuditActions.LoginFailed,
                user.Id,
                user.UserName,
                null,
                "no_active_membership",
                cancellationToken);

            return null;
        }

        var response = await BuildLoginResponseAsync(
            user,
            companyId,
            cancellationToken);

        user.LastLoginAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        await RecordSecurityEventAsync(
            AuditActions.Login,
            user.Id,
            user.UserName,
            companyId,
            null,
            cancellationToken);

        return response;
    }

    // Returns true when this failure locked the account.
    private async Task<bool> RegisterFailedAttemptAsync(
        Domain.Entities.Security.User user,
        DateTime now,
        CancellationToken cancellationToken)
    {
        if (!_lockout.Enabled)
        {
            return false;
        }

        user.FailedLoginCount++;

        bool locked = user.FailedLoginCount >= _lockout.MaxFailedAttempts;

        if (locked)
        {
            user.LockoutEnd = now.AddMinutes(_lockout.LockoutMinutes);
            user.FailedLoginCount = 0;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return locked;
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

        var selected = await BuildLoginResponseAsync(
            user,
            companyId,
            cancellationToken);

        await RecordSecurityEventAsync(
            AuditActions.SelectCompany,
            user.Id,
            user.UserName,
            companyId,
            null,
            cancellationToken);

        return selected;
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
            // Platform administrators must be able to inspect and reactivate
            // inactive companies, but soft-deleted companies remain inaccessible.
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

        string token = _jwtService.GenerateToken(
            user.Id,
            user.UserName,
            roles,
            permissions,
            companyId,
            IsPlatformAdmin(user));

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
            await RecordSecurityEventAsync(
                AuditActions.PasswordChangeFailed,
                userId,
                user?.UserName,
                null,
                "current_password_rejected",
                cancellationToken);

            return false;
        }

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        user.MustChangePassword = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await RecordSecurityEventAsync(
            AuditActions.PasswordChanged,
            user.Id,
            user.UserName,
            null,
            null,
            cancellationToken);

        return true;
    }
}
