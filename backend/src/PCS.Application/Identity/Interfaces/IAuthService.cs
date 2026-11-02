using PCS.Application.Identity.DTOs;

namespace PCS.Application.Identity.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default);

    Task<LoginResponse?> GetCurrentUserAsync(
        Guid userId,
        Guid? companyId,
        CancellationToken cancellationToken = default);

    Task<LoginResponse?> SelectCompanyAsync(
        Guid userId,
        Guid companyId,
        CancellationToken cancellationToken = default);

    Task<bool> ChangePasswordAsync(
        Guid userId,
        ChangePasswordRequest request,
        CancellationToken cancellationToken = default);
}