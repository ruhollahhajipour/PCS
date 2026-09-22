using PCS.Application.Licensing.DTOs;

namespace PCS.Application.Licensing.Interfaces;

public interface ILicenseService
{
    /// <summary>
    /// Determines whether a company has access to the specified module.
    /// Project Controls is always available as a free built-in module.
    /// </summary>
    Task<bool> HasModuleAccessAsync(
        Guid companyId,
        string moduleId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the current license status and module entitlements
    /// for the specified company.
    /// </summary>
    Task<LicenseStatusDto> GetStatusAsync(
        Guid companyId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Determines whether a user is an active member of a company.
    /// </summary>
    Task<bool> IsUserCompanyMemberAsync(
        Guid userId,
        Guid companyId,
        CancellationToken cancellationToken = default);
}