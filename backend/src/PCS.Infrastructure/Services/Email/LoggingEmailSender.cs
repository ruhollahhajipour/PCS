using Microsoft.Extensions.Logging;

using PCS.Application.Common.Interfaces;

namespace PCS.Infrastructure.Services.Email;

/// <summary>
/// DEVELOPMENT ONLY. Writes the whole message, including one-time codes, to the
/// log. The API refuses to start with this provider outside Development.
/// </summary>
public sealed class LoggingEmailSender : IEmailSender
{
    private readonly ILogger<LoggingEmailSender> _logger;

    public LoggingEmailSender(ILogger<LoggingEmailSender> logger)
    {
        _logger = logger;
    }

    public Task SendAsync(
        EmailMessage message,
        CancellationToken cancellationToken = default)
    {
        _logger.LogWarning(
            "DEV EMAIL to {To}, subject {Subject}:{NewLine}{Body}",
            message.To,
            message.Subject,
            Environment.NewLine,
            message.Body);

        return Task.CompletedTask;
    }
}
