using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using PCS.Infrastructure.Persistence;

namespace PCS.API.Security;

/// <summary>
/// Enforces company membership at the API resource boundary.
/// A permission claim grants an operation; this guard independently
/// verifies that the authenticated user belongs to the resource's company.
/// </summary>
public sealed class ProjectAccessGuard : IProjectAccessGuard
{
    private readonly PCSDbContext _dbContext;

    public ProjectAccessGuard(PCSDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<Guid>> GetAccessibleCompanyIdsAsync(
        ClaimsPrincipal principal,
        CancellationToken cancellationToken = default)
    {
        var user = await GetUserContextAsync(principal, cancellationToken);
        if (user is null)
            return Array.Empty<Guid>();

        if (user.IsSystemUser)
        {
            // System administrators must be able to inspect and reactivate
            // disabled companies; deleted companies remain inaccessible.
            return await _dbContext.Companies
                .AsNoTracking()
                .Where(x => !x.IsDeleted)
                .Select(x => x.Id)
                .ToListAsync(cancellationToken);
        }

        return await _dbContext.CompanyUsers
            .AsNoTracking()
            .Where(x =>
                x.UserId == user.Id &&
                x.IsActive &&
                !x.IsDeleted &&
                x.Company.IsActive &&
                !x.Company.IsDeleted)
            .Select(x => x.CompanyId)
            .Distinct()
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsSystemUserAsync(
        ClaimsPrincipal principal,
        CancellationToken cancellationToken = default)
    {
        var user = await GetUserContextAsync(principal, cancellationToken);
        return user?.IsSystemUser == true;
    }

    public async Task<bool> CanAccessCompanyAsync(
        ClaimsPrincipal principal,
        Guid companyId,
        CancellationToken cancellationToken = default)
    {
        if (companyId == Guid.Empty)
            return false;

        var user = await GetUserContextAsync(principal, cancellationToken);
        if (user is null)
            return false;

        if (user.IsSystemUser)
        {
            return await _dbContext.Companies
                .AsNoTracking()
                .AnyAsync(
                    x => x.Id == companyId && !x.IsDeleted,
                    cancellationToken);
        }

        return await _dbContext.CompanyUsers
            .AsNoTracking()
            .AnyAsync(
                x => x.UserId == user.Id &&
                     x.CompanyId == companyId &&
                     x.IsActive &&
                     !x.IsDeleted &&
                     x.Company.IsActive &&
                     !x.Company.IsDeleted,
                cancellationToken);
    }

    public async Task<bool> CanAccessProjectAsync(
        ClaimsPrincipal principal,
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        if (projectId == Guid.Empty)
            return false;

        var user = await GetUserContextAsync(principal, cancellationToken);
        if (user is null)
            return false;

        var projects = _dbContext.Projects
            .AsNoTracking()
            .Where(x => x.Id == projectId && !x.IsDeleted);

        if (user.IsSystemUser)
        {
            return await projects.AnyAsync(
                x => !x.Company.IsDeleted,
                cancellationToken);
        }

        return await projects.AnyAsync(
            x => x.Company.IsActive &&
                 !x.Company.IsDeleted &&
                 x.Company.Users.Any(membership =>
                     membership.UserId == user.Id &&
                     membership.IsActive &&
                     !membership.IsDeleted),
            cancellationToken);
    }

    public async Task<bool> CanAccessActivityAsync(
        ClaimsPrincipal principal,
        Guid activityId,
        CancellationToken cancellationToken = default)
    {
        if (activityId == Guid.Empty)
            return false;

        var user = await GetUserContextAsync(principal, cancellationToken);
        if (user is null)
            return false;

        var activities = _dbContext.Activities
            .AsNoTracking()
            .Where(x => x.Id == activityId && !x.IsDeleted);

        if (user.IsSystemUser)
        {
            return await activities.AnyAsync(
                x => !x.Project.IsDeleted && !x.Project.Company.IsDeleted,
                cancellationToken);
        }

        return await activities.AnyAsync(
            x => !x.Project.IsDeleted &&
                 x.Project.Company.IsActive &&
                 !x.Project.Company.IsDeleted &&
                 x.Project.Company.Users.Any(membership =>
                     membership.UserId == user.Id &&
                     membership.IsActive &&
                     !membership.IsDeleted),
            cancellationToken);
    }

    public async Task<bool> CanAccessWbsAsync(
        ClaimsPrincipal principal,
        Guid wbsNodeId,
        CancellationToken cancellationToken = default)
    {
        if (wbsNodeId == Guid.Empty)
            return false;

        var user = await GetUserContextAsync(principal, cancellationToken);
        if (user is null)
            return false;

        var nodes = _dbContext.WbsNodes
            .AsNoTracking()
            .Where(x => x.Id == wbsNodeId && !x.IsDeleted);

        if (user.IsSystemUser)
        {
            return await nodes.AnyAsync(
                x => !x.Project.IsDeleted && !x.Project.Company.IsDeleted,
                cancellationToken);
        }

        return await nodes.AnyAsync(
            x => !x.Project.IsDeleted &&
                 x.Project.Company.IsActive &&
                 !x.Project.Company.IsDeleted &&
                 x.Project.Company.Users.Any(membership =>
                     membership.UserId == user.Id &&
                     membership.IsActive &&
                     !membership.IsDeleted),
            cancellationToken);
    }

    public async Task<bool> CanAccessPlantAsync(
        ClaimsPrincipal principal,
        Guid plantId,
        Guid? expectedCompanyId = null,
        CancellationToken cancellationToken = default)
    {
        if (plantId == Guid.Empty)
            return false;

        var user = await GetUserContextAsync(principal, cancellationToken);
        if (user is null)
            return false;

        var plants = _dbContext.Plants
            .AsNoTracking()
            .Where(x => x.Id == plantId && !x.IsDeleted);

        if (expectedCompanyId.HasValue)
            plants = plants.Where(x => x.CompanyId == expectedCompanyId.Value);

        if (user.IsSystemUser)
        {
            return await plants.AnyAsync(
                x => !x.Company.IsDeleted,
                cancellationToken);
        }

        return await plants.AnyAsync(
            x => x.Company.IsActive &&
                 !x.Company.IsDeleted &&
                 x.Company.Users.Any(membership =>
                     membership.UserId == user.Id &&
                     membership.IsActive &&
                     !membership.IsDeleted),
            cancellationToken);
    }

    private async Task<UserContext?> GetUserContextAsync(
        ClaimsPrincipal principal,
        CancellationToken cancellationToken)
    {
        var claimValue = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(claimValue, out var userId) || userId == Guid.Empty)
            return null;

        return await _dbContext.Users
            .AsNoTracking()
            .Where(x => x.Id == userId && x.IsActive && !x.IsDeleted)
            .Select(x => new UserContext(x.Id, x.IsSystemUser))
            .SingleOrDefaultAsync(cancellationToken);
    }

    private sealed record UserContext(Guid Id, bool IsSystemUser);
}
