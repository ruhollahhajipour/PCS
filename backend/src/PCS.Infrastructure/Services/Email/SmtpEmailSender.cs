using System.Net;
using System.Net.Mail;

using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;

namespace PCS.Infrastructure.Services.Email;

public sealed class SmtpEmailSender : IEmailSender
{
    private readonly EmailOptions _options;

    public SmtpEmailSender(EmailOptions options)
    {
        _options = options;
    }

    public async Task SendAsync(
        EmailMessage message,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.Host) ||
            string.IsNullOrWhiteSpace(_options.From))
        {
            throw new InvalidOperationException(
                "Email:Host and Email:From must be set when Email:Provider is Smtp.");
        }

        using var mail = new MailMessage(
            _options.From,
            message.To,
            message.Subject,
            message.Body);

        using var client = new SmtpClient(_options.Host, _options.Port)
        {
            EnableSsl = _options.EnableSsl,
            Timeout = 15000
        };

        if (!string.IsNullOrWhiteSpace(_options.UserName))
        {
            client.Credentials = new NetworkCredential(
                _options.UserName,
                _options.Password);
        }

        await client.SendMailAsync(mail, cancellationToken);
    }
}
