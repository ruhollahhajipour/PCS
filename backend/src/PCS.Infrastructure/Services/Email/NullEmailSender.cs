using Microsoft.Extensions.Logging;

using PCS.Application.Common.Interfaces;

namespace PCS.Infrastructure.Services.Email;

/// <summary>Used when no email transport is configured. Nothing is sent or logged beyond the fact.</summary>
public sealed class NullEmailSender : IEmailSender
{
    private readonly ILogger<NullEmailSender>? _logger;

    public NullEmailSender(ILogger<NullEmailSender>? logger = null)
    {
        _logger = logger;
    }

    public Task SendAsync(
        EmailMessage message,
        CancellationToken cancellationToken = default)
    {
        _logger?.LogWarning(
            "Email is not configured (Email:Provider); a message was not sent.");

        return Task.CompletedTask;
    }
}
