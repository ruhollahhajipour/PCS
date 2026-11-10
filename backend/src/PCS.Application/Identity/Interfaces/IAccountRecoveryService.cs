namespace PCS.Application.Identity.Interfaces;

public interface IAccountRecoveryService
{
    /// <summary>
    /// Emails a one-time reset code when the account exists and has an address.
    /// Always completes the same way, so callers cannot learn which accounts exist.
    /// </summary>
    Task RequestPasswordResetAsync(
        string identifier,
        CancellationToken cancellationToken = default);

    /// <summary>True when the code was valid and the password was changed.</summary>
    Task<bool> ResetPasswordAsync(
        string identifier,
        string code,
        string newPassword,
        CancellationToken cancellationToken = default);

    /// <summary>False when there is nothing to send (no address, already verified, cooling down).</summary>
    Task<bool> SendEmailVerificationAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<bool> VerifyEmailAsync(
        Guid userId,
        string code,
        CancellationToken cancellationToken = default);
}
