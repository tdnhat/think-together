namespace ThinkTogether.Domain.Aggregates.UserAggregate.Services;

public interface IEmailService
{
    Task SendWelcomeEmailAsync(
        string recipientEmail,
        string recipientName,
        CancellationToken cancellationToken = default);

    Task SendPasswordResetEmailAsync(
        string recipientEmail,
        string recipientName,
        string resetToken,
        string resetLink,
        CancellationToken cancellationToken = default);

    Task SendEmailConfirmationAsync(
        string recipientEmail,
        string recipientName,
        string confirmationLink,
        CancellationToken cancellationToken = default);

    Task SendAsync(
        string recipientEmail,
        string subject,
        string htmlBody,
        CancellationToken cancellationToken = default);
}
