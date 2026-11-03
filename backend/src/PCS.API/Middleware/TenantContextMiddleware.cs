using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

using Microsoft.EntityFrameworkCore;

using PCS.Application.Identity.Interfaces;
using PCS.Infrastructure.Persistence;

namespace PCS.API.Middleware;

public sealed class TenantContextMiddleware
{
    private readonly RequestDelegate _next;

    public TenantContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context,
        PCSDbContext dbContext,
        IJwtService jwtService)
    {
        if (context.User.Identity?.IsAuthenticated != true)
        {
            await _next(context);
            return;
        }

        if (!Guid.TryParse(
                context.User.FindFirstValue(ClaimTypes.NameIdentifier),
                out Guid userId))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        var userSecurity = await dbContext.Users
            .IgnoreQueryFilters()
            .Where(x => x.Id == userId && x.IsActive && !x.IsDeleted)
            .Select(x => new { x.PasswordHash })
            .SingleOrDefaultAsync(context.RequestAborted);

        if (userSecurity is null)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        string? suppliedSecurityStamp =
            context.User.FindFirstValue("security_stamp");

        if (string.IsNullOrWhiteSpace(suppliedSecurityStamp))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        byte[] expectedStamp = Encoding.UTF8.GetBytes(
            jwtService.CreateSecurityStamp(userSecurity.PasswordHash));
        byte[] actualStamp = Encoding.UTF8.GetBytes(suppliedSecurityStamp);

        if (expectedStamp.Length != actualStamp.Length ||
            !CryptographicOperations.FixedTimeEquals(expectedStamp, actualStamp))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        bool tokenClaimsPlatformAdmin =
            context.User.HasClaim("platform_admin", "true");

        bool hasActivePlatformAdminRole = tokenClaimsPlatformAdmin &&
            await dbContext.UserRoles
                .IgnoreQueryFilters()
                .AnyAsync(
                    x =>
                        x.UserId == userId &&
                        x.IsActive &&
                        x.CompanyId == null &&
                        x.Role.IsActive &&
                        x.Role.Scope == "Platform" &&
                        x.Role.Code == "SUPER_ADMIN",
                    context.RequestAborted);

        // The platform-admin flag is accepted only when the assignment is
        // still active in the authoritative database.
        bool isPlatformAdmin = hasActivePlatformAdminRole;

        Guid? tokenCompanyId =
            Guid.TryParse(
                context.User.FindFirstValue("company_id"),
                out Guid parsedTokenCompanyId)
                ? parsedTokenCompanyId
                : null;

        string? companyHeader =
            context.Request.Headers["X-PCS-CompanyId"].FirstOrDefault();

        Guid? headerCompanyId = null;
        if (!string.IsNullOrWhiteSpace(companyHeader))
        {
            if (!Guid.TryParse(companyHeader, out Guid parsedHeaderCompanyId))
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsync(
                    "X-PCS-CompanyId must contain a valid company identifier.");
                return;
            }

            headerCompanyId = parsedHeaderCompanyId;
        }

        if (tokenCompanyId.HasValue &&
            headerCompanyId.HasValue &&
            tokenCompanyId.Value != headerCompanyId.Value)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }

        Guid? activeCompanyId =
            tokenCompanyId ?? (isPlatformAdmin ? headerCompanyId : null);

        if (!activeCompanyId.HasValue && !isPlatformAdmin)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }

        if (activeCompanyId.HasValue)
        {
            bool companyExists = await dbContext.Companies
                .IgnoreQueryFilters()
                .AnyAsync(
                    x =>
                        x.Id == activeCompanyId.Value &&
                        !x.IsDeleted &&
                        (isPlatformAdmin || x.IsActive),
                    context.RequestAborted);

            if (!companyExists)
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                return;
            }

            if (!isPlatformAdmin)
            {
                bool isMember = await dbContext.CompanyUsers
                    .IgnoreQueryFilters()
                    .AnyAsync(
                        x =>
                            x.UserId == userId &&
                            x.CompanyId == activeCompanyId.Value &&
                            x.IsActive &&
                            !x.IsDeleted &&
                            x.User.IsActive &&
                            !x.User.IsDeleted &&
                            x.Company.IsActive &&
                            !x.Company.IsDeleted,
                        context.RequestAborted);

                if (!isMember)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return;
                }
            }
        }

        context.Items["PCS.UserId"] = userId;
        context.Items["PCS.CompanyId"] = activeCompanyId;
        context.Items["PCS.IsPlatformAdmin"] = isPlatformAdmin;

        await _next(context);
    }
}