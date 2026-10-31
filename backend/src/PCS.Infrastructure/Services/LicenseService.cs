using Microsoft.EntityFrameworkCore;

using PCS.Application.Licensing;
using PCS.Application.Licensing.DTOs;
using PCS.Application.Licensing.Interfaces;

using PCS.Domain.Entities.Licensing;

using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Services;

public class LicenseService : ILicenseService
{
    private readonly PCSDbContext _dbContext;

    public LicenseService(PCSDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    // ============================================================
    // Module Access
    // ============================================================

    public async Task<bool> HasModuleAccessAsync(
        Guid companyId,
        string moduleId,
        CancellationToken cancellationToken = default)
    {
        if (companyId == Guid.Empty ||
            string.IsNullOrWhiteSpace(moduleId))
        {
            return false;
        }


        // ========================================================
        // Project Controls is always free
        // ========================================================

        if (string.Equals(
                moduleId,
                PcsModules.ProjectControls,
                StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }


        DateTime now =
            DateTime.UtcNow;


        return await _dbContext.Licenses
            .AsNoTracking()
            .Where(x =>
                x.CompanyId == companyId &&
                x.Status == LicenseStatus.Active &&
                !x.IsDeleted &&
                (x.ExpiresAt == null ||
                 x.ExpiresAt > now))
            .SelectMany(x => x.Modules)
            .AnyAsync(
                x =>
                    x.ModuleId == moduleId &&
                    x.IsActive &&
                    !x.IsDeleted &&
                    (x.ExpiresAt == null ||
                     x.ExpiresAt > now),
                cancellationToken);
    }


    // ============================================================
    // License Status
    // ============================================================

    public async Task<LicenseStatusDto> GetStatusAsync(
        Guid companyId,
        CancellationToken cancellationToken = default)
    {
        if (companyId == Guid.Empty)
        {
            return new LicenseStatusDto();
        }


        DateTime now =
            DateTime.UtcNow;


        var license =
            await _dbContext.Licenses
                .AsNoTracking()
                .Include(x => x.Modules)
                .Where(x =>
                    x.CompanyId == companyId &&
                    !x.IsDeleted)
                .OrderByDescending(x => x.IssuedAt)
                .FirstOrDefaultAsync(
                    cancellationToken);


        if (license is null)
        {
            return new LicenseStatusDto
            {
                HasLicense = false,
                Status = "None"
            };
        }


        string status =
            license.Status.ToString();


        if (license.Status == LicenseStatus.Active &&
            license.ExpiresAt.HasValue &&
            license.ExpiresAt.Value <= now)
        {
            status =
                LicenseStatus.Expired.ToString();
        }


        var modules =
            license.Modules
                .Where(x => !x.IsDeleted)
                .Select(x => new LicenseModuleDto
                {
                    ModuleId = x.ModuleId,

                    IsActive =
                        x.IsActive &&
                        (x.ExpiresAt == null ||
                         x.ExpiresAt > now) &&
                        license.Status == LicenseStatus.Active &&
                        (license.ExpiresAt == null ||
                         license.ExpiresAt > now),

                    ExpiresAt =
                        x.ExpiresAt
                })
                .ToList();


        return new LicenseStatusDto
        {
            HasLicense = true,

            LicenseKey =
                license.LicenseKey,

            Status =
                status,

            IssuedAt =
                license.IssuedAt,

            ExpiresAt =
                license.ExpiresAt,

            Modules =
                modules
        };
    }


    // ============================================================
    // Company Membership
    // ============================================================

    public async Task<bool> IsUserCompanyMemberAsync(
        Guid userId,
        Guid companyId,
        CancellationToken cancellationToken = default)
    {
        if (userId == Guid.Empty ||
            companyId == Guid.Empty)
        {
            return false;
        }


        return await _dbContext.CompanyUsers
            .AsNoTracking()
            .AnyAsync(
                x =>
                    x.UserId == userId &&
                    x.CompanyId == companyId &&
                    x.IsActive &&
                    !x.IsDeleted,
                cancellationToken);
    }
}