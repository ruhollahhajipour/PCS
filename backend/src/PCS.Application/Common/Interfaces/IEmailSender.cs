namespace PCS.Application.Common.Interfaces;

public sealed record EmailMessage(string To, string Subject, string Body);

public interface IEmailSender
{
    Task SendAsync(
        EmailMessage message,
        CancellationToken cancellationToken = default);
}
