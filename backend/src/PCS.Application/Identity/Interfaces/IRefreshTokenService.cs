using PCS.Application.Identity.DTOs;

namespace PCS.Application.Identity.Interfaces;

public interface IRefreshTokenService
{
    /// <summary>Starts a new session and returns its first refresh token.</summary>
    Task<IssuedRefreshToken> IssueAsync(
        Guid userId,
        Guid? companyId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Exchanges a valid refresh token for the next one. Returns null when the
    /// token is unknown, expired, revoked or reused (reuse revokes the session).
    /// </summary>
    Task<RefreshRotation?> RotateAsync(
        string refreshToken,
        Guid? companyId,
        CancellationToken cancellationToken = default);

    /// <summary>Ends the session the token belongs to. Unknown tokens are ignored.</summary>
    Task RevokeByTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken = default);

    Task RevokeFamilyAsync(
        Guid familyId,
        string reason,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<SessionDto>> ListSessionsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>Ends one of the user's own sessions. False when it is not theirs or not active.</summary>
    Task<bool> RevokeSessionAsync(
        Guid userId,
        Guid sessionId,
        CancellationToken cancellationToken = default);

    Task RevokeAllForUserAsync(
        Guid userId,
        string reason,
        CancellationToken cancellationToken = default);
}
