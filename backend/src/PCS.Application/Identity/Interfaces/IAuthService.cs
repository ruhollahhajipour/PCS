using PCS.Application.Identity.DTOs;

namespace PCS.Application.Identity.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default);

    Task<LoginResponse?> GetCurrentUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<bool> ChangePasswordAsync(
        Guid userId,
        ChangePasswordRequest request,
        CancellationToken cancellationToken = default);
}