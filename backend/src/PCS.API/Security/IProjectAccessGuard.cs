using System.Security.Claims;

namespace PCS.API.Security;

public interface IProjectAccessGuard
{
    Task<IReadOnlyCollection<Guid>> GetAccessibleCompanyIdsAsync(
        ClaimsPrincipal principal,
        CancellationToken cancellationToken = default);

    Task<bool> IsSystemUserAsync(
        ClaimsPrincipal principal,
        CancellationToken cancellationToken = default);

    Task<bool> CanAccessCompanyAsync(
        ClaimsPrincipal principal,
        Guid companyId,
        CancellationToken cancellationToken = default);

    Task<bool> CanAccessProjectAsync(
        ClaimsPrincipal principal,
        Guid projectId,
        CancellationToken cancellationToken = default);

    Task<bool> CanAccessActivityAsync(
        ClaimsPrincipal principal,
        Guid activityId,
        CancellationToken cancellationToken = default);

    Task<bool> CanAccessWbsAsync(
        ClaimsPrincipal principal,
        Guid wbsNodeId,
        CancellationToken cancellationToken = default);

    Task<bool> CanAccessPlantAsync(
        ClaimsPrincipal principal,
        Guid plantId,
        Guid? expectedCompanyId = null,
        CancellationToken cancellationToken = default);
}
