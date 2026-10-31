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
        var userId = await GetActiveUserIdAsync(principal, cancellationToken);
        if (!userId.HasValue)
            return Array.Empty<Guid>();

        var isSystemUser = await _dbContext.Users
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == userId.Value && x.IsActive && !x.IsDeleted && x.IsSystemUser,
                cancellationToken);

        if (isSystemUser)
        {
            return await _dbContext.Companies
                .AsNoTracking()
                .Where(x => x.IsActive && !x.IsDeleted)
                .Select(x => x.Id)
                .ToListAsync(cancellationToken);
        }

        return await _dbContext.CompanyUsers
            .AsNoTracking()
            .Where(x =>
                x.UserId == userId.Value &&
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
        var userId = await GetActiveUserIdAsync(principal, cancellationToken);
        if (!userId.HasValue)
            return false;

        return await _dbContext.Users
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == userId.Value &&
                     x.IsActive &&
                     !x.IsDeleted &&
                     x.IsSystemUser,
                cancellationToken);
    }

    public async Task<bool> CanAccessCompanyAsync(
        ClaimsPrincipal principal,
        Guid companyId,
        CancellationToken cancellationToken = default)
    {
        if (companyId == Guid.Empty)
            return false;

        var userId = await GetActiveUserIdAsync(principal, cancellationToken);
        if (!userId.HasValue)
            return false;

        var companyIsActive = await _dbContext.Companies
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == companyId && x.IsActive && !x.IsDeleted,
                cancellationToken);

        if (!companyIsActive)
            return false;

        var isSystemUser = await _dbContext.Users
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == userId.Value &&
                     x.IsActive &&
                     !x.IsDeleted &&
                     x.IsSystemUser,
                cancellationToken);

        if (isSystemUser)
            return true;

        return await _dbContext.CompanyUsers
            .AsNoTracking()
            .AnyAsync(
                x => x.UserId == userId.Value &&
                     x.CompanyId == companyId &&
                     x.IsActive &&
                     !x.IsDeleted,
                cancellationToken);
    }

    public async Task<bool> CanAccessProjectAsync(
        ClaimsPrincipal principal,
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        if (projectId == Guid.Empty)
            return false;

        var companyId = await _dbContext.Projects
            .AsNoTracking()
            .Where(x => x.Id == projectId && !x.IsDeleted)
            .Select(x => (Guid?)x.CompanyId)
            .SingleOrDefaultAsync(cancellationToken);

        return companyId.HasValue &&
               await CanAccessCompanyAsync(principal, companyId.Value, cancellationToken);
    }

    public async Task<bool> CanAccessActivityAsync(
        ClaimsPrincipal principal,
        Guid activityId,
        CancellationToken cancellationToken = default)
    {
        if (activityId == Guid.Empty)
            return false;

        var projectId = await _dbContext.Activities
            .AsNoTracking()
            .Where(x => x.Id == activityId && !x.IsDeleted)
            .Select(x => (Guid?)x.ProjectId)
            .SingleOrDefaultAsync(cancellationToken);

        return projectId.HasValue &&
               await CanAccessProjectAsync(principal, projectId.Value, cancellationToken);
    }

    public async Task<bool> CanAccessWbsAsync(
        ClaimsPrincipal principal,
        Guid wbsNodeId,
        CancellationToken cancellationToken = default)
    {
        if (wbsNodeId == Guid.Empty)
            return false;

        var projectId = await _dbContext.WbsNodes
            .AsNoTracking()
            .Where(x => x.Id == wbsNodeId && !x.IsDeleted)
            .Select(x => (Guid?)x.ProjectId)
            .SingleOrDefaultAsync(cancellationToken);

        return projectId.HasValue &&
               await CanAccessProjectAsync(principal, projectId.Value, cancellationToken);
    }

    public async Task<bool> CanAccessPlantAsync(
        ClaimsPrincipal principal,
        Guid plantId,
        Guid? expectedCompanyId = null,
        CancellationToken cancellationToken = default)
    {
        if (plantId == Guid.Empty)
            return false;

        var companyId = await _dbContext.Plants
            .AsNoTracking()
            .Where(x => x.Id == plantId && !x.IsDeleted)
            .Select(x => (Guid?)x.CompanyId)
            .SingleOrDefaultAsync(cancellationToken);

        if (!companyId.HasValue ||
            (expectedCompanyId.HasValue && expectedCompanyId.Value != companyId.Value))
        {
            return false;
        }

        return await CanAccessCompanyAsync(principal, companyId.Value, cancellationToken);
    }

    private async Task<Guid?> GetActiveUserIdAsync(
        ClaimsPrincipal principal,
        CancellationToken cancellationToken)
    {
        var claimValue = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(claimValue, out var userId) || userId == Guid.Empty)
            return null;

        var isActive = await _dbContext.Users
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == userId && x.IsActive && !x.IsDeleted,
                cancellationToken);

        return isActive ? userId : null;
    }
}
