using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using PCS.Infrastructure.Persistence;

namespace PCS.API.Security;

public sealed class PermissionAuthorizationHandler
    : AuthorizationHandler<PermissionRequirement>
{
    private readonly PCSDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PermissionAuthorizationHandler(
        PCSDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        HttpContext? httpContext = _httpContextAccessor.HttpContext;
        if (httpContext is null ||
            !Guid.TryParse(
                context.User.FindFirstValue(ClaimTypes.NameIdentifier),
                out Guid userId))
        {
            return;
        }

        Guid? companyId =
            httpContext.Items["PCS.CompanyId"] is Guid selectedCompanyId
                ? selectedCompanyId
                : null;

        bool isPlatformAdmin =
            httpContext.Items["PCS.IsPlatformAdmin"] is true;

        if (!companyId.HasValue && !isPlatformAdmin)
        {
            return;
        }

        CancellationToken cancellationToken =
            httpContext.RequestAborted;

        bool userIsActive = await _dbContext.Users
            .IgnoreQueryFilters()
            .AnyAsync(
                user =>
                    user.Id == userId &&
                    user.IsActive &&
                    !user.IsDeleted,
                cancellationToken);

        if (!userIsActive)
        {
            return;
        }

        bool hasPermission = await _dbContext.UserRoles
            .IgnoreQueryFilters()
            .AnyAsync(
                assignment =>
                    assignment.UserId == userId &&
                    assignment.IsActive &&
                    assignment.Role.IsActive &&
                    (
                        (
                            assignment.Role.Scope == "Platform" &&
                            assignment.CompanyId == null &&
                            isPlatformAdmin
                        ) ||
                        (
                            (assignment.Role.Scope == "Company" ||
                             assignment.Role.Scope == "Project") &&
                            companyId.HasValue &&
                            assignment.CompanyId == companyId.Value
                        )
                    ) &&
                    assignment.Role.RolePermissions.Any(
                        rolePermission =>
                            rolePermission.Permission.IsActive &&
                            rolePermission.Permission.Code == requirement.Permission),
                cancellationToken);

        if (hasPermission)
        {
            context.Succeed(requirement);
        }
    }
}