using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Infrastructure.Configuration;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Infrastructure.Templates;

namespace ThinkTogether.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly EmailOptions _emailOptions;
    private readonly ILogger<EmailService> _logger;

    public EmailService(
        IOptions<EmailOptions> emailOptions,
        ILogger<EmailService> logger)
    {
        _emailOptions = emailOptions.Value;
        _logger = logger;
    }

    public async Task SendWelcomeEmailAsync(
        string recipientEmail,
        string recipientName,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Sending welcome email to {RecipientEmail} for {RecipientName}", recipientEmail, recipientName);

            var htmlBody = WelcomeEmailTemplate.Build(recipientName);
            const string subject = "Welcome to ThinkTogether!";

            await SendAsync(recipientEmail, subject, htmlBody, cancellationToken);

            _logger.LogInformation("Welcome email sent successfully to {RecipientEmail}", recipientEmail);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Welcome email sending was cancelled for {RecipientEmail}", recipientEmail);
            throw new EmailServiceException("Welcome email sending was cancelled.", ex);
        }
        catch (SmtpCommandException ex)
        {
            _logger.LogError(ex, "SMTP command error while sending welcome email to {RecipientEmail}. StatusCode: {StatusCode}", recipientEmail, ex.StatusCode);
            throw new EmailServiceException($"SMTP error occurred while sending welcome email to {recipientEmail}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error sending welcome email to {RecipientEmail}", recipientEmail);
            throw new EmailServiceException($"Failed to send welcome email to {recipientEmail}", ex);
        }
    }

    public async Task SendPasswordResetEmailAsync(
        string recipientEmail,
        string recipientName,
        string resetToken,
        string resetLink,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Sending password reset email to {RecipientEmail} for {RecipientName}", recipientEmail, recipientName);

            var htmlBody = PasswordResetEmailTemplate.Build(recipientName, resetLink);
            const string subject = "Reset Your ThinkTogether Password";

            await SendAsync(recipientEmail, subject, htmlBody, cancellationToken);

            _logger.LogInformation("Password reset email sent successfully to {RecipientEmail}", recipientEmail);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Password reset email sending was cancelled for {RecipientEmail}", recipientEmail);
            throw new EmailServiceException("Password reset email sending was cancelled.", ex);
        }
        catch (SmtpCommandException ex)
        {
            _logger.LogError(ex, "SMTP command error while sending password reset email to {RecipientEmail}. StatusCode: {StatusCode}", recipientEmail, ex.StatusCode);
            throw new EmailServiceException($"SMTP error occurred while sending password reset email to {recipientEmail}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error sending password reset email to {RecipientEmail}", recipientEmail);
            throw new EmailServiceException($"Failed to send password reset email to {recipientEmail}", ex);
        }
    }

    public async Task SendEmailConfirmationAsync(
        string recipientEmail,
        string recipientName,
        string confirmationLink,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Sending email confirmation to {RecipientEmail} for {RecipientName}", recipientEmail, recipientName);

            var htmlBody = EmailConfirmationTemplate.Build(recipientName, confirmationLink);
            const string subject = "Confirm Your Email - ThinkTogether";

            await SendAsync(recipientEmail, subject, htmlBody, cancellationToken);

            _logger.LogInformation("Email confirmation sent successfully to {RecipientEmail}", recipientEmail);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Email confirmation sending was cancelled for {RecipientEmail}", recipientEmail);
            throw new EmailServiceException("Email confirmation sending was cancelled.", ex);
        }
        catch (SmtpCommandException ex)
        {
            _logger.LogError(ex, "SMTP command error while sending email confirmation to {RecipientEmail}. StatusCode: {StatusCode}", recipientEmail, ex.StatusCode);
            throw new EmailServiceException($"SMTP error occurred while sending email confirmation to {recipientEmail}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error sending email confirmation to {RecipientEmail}", recipientEmail);
            throw new EmailServiceException($"Failed to send email confirmation to {recipientEmail}", ex);
        }
    }

    public async Task SendEmailConfirmationEmailAsync(
        string recipientEmail,
        string recipientName,
        string confirmationToken,
        string confirmationLink,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Sending email confirmation email to {RecipientEmail} for {RecipientName}", recipientEmail, recipientName);

            var htmlBody = EmailConfirmationTemplate.Build(recipientName, confirmationLink);
            const string subject = "Xác nhận email của bạn - ThinkTogether";

            await SendAsync(recipientEmail, subject, htmlBody, cancellationToken);

            _logger.LogInformation("Email confirmation email sent successfully to {RecipientEmail}", recipientEmail);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Email confirmation email sending was cancelled for {RecipientEmail}", recipientEmail);
            throw new EmailServiceException("Email confirmation email sending was cancelled.", ex);
        }
        catch (SmtpCommandException ex)
        {
            _logger.LogError(ex, "SMTP command error while sending email confirmation email to {RecipientEmail}. StatusCode: {StatusCode}", recipientEmail, ex.StatusCode);
            throw new EmailServiceException($"SMTP error occurred while sending email confirmation email to {recipientEmail}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while sending email confirmation email to {RecipientEmail}", recipientEmail);
            throw new EmailServiceException($"An unexpected error occurred while sending email confirmation email to {recipientEmail}", ex);
        }
    }

    public async Task SendAsync(
        string recipientEmail,
        string subject,
        string htmlBody,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Sending email to {RecipientEmail} with subject: {Subject}", recipientEmail, subject);

            // Create email message
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailOptions.SenderName, _emailOptions.SenderEmail));
            message.To.Add(MailboxAddress.Parse(recipientEmail));
            message.Subject = subject;

            // Create body with both plain text and HTML
            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlBody,
                TextBody = ConvertHtmlToPlainText(htmlBody)
            };

            message.Body = bodyBuilder.ToMessageBody();

            // Send email via SMTP
            await SendViaSmtpAsync(message, cancellationToken);

            _logger.LogInformation("Email sent successfully to {RecipientEmail}", recipientEmail);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Email sending was cancelled for {RecipientEmail} with subject: {Subject}", recipientEmail, subject);
            throw new EmailServiceException($"Email sending was cancelled for {recipientEmail}", ex);
        }
        catch (FormatException ex)
        {
            _logger.LogWarning(ex, "Invalid email format for {RecipientEmail}", recipientEmail);
            throw new EmailServiceException($"Invalid email address format: {recipientEmail}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error sending email to {RecipientEmail} with subject: {Subject}", recipientEmail, subject);
            throw new EmailServiceException($"Failed to send email to {recipientEmail}", ex);
        }
    }

    private async Task SendViaSmtpAsync(MimeMessage message, CancellationToken cancellationToken)
    {
        using var client = new SmtpClient();

        try
        {
            // Set timeout
            client.Timeout = _emailOptions.TimeoutSeconds * 1000;

            // Connect to SMTP server
            if (_emailOptions.UseSsl)
            {
                await client.ConnectAsync(
                    _emailOptions.SmtpHost,
                    _emailOptions.SmtpPort,
                    SecureSocketOptions.SslOnConnect,
                    cancellationToken);
            }
            else if (_emailOptions.UseStartTls)
            {
                await client.ConnectAsync(
                    _emailOptions.SmtpHost,
                    _emailOptions.SmtpPort,
                    SecureSocketOptions.StartTls,
                    cancellationToken);
            }
            else
            {
                await client.ConnectAsync(
                    _emailOptions.SmtpHost,
                    _emailOptions.SmtpPort,
                    SecureSocketOptions.None,
                    cancellationToken);
            }

            // Authenticate
            await client.AuthenticateAsync(
                _emailOptions.Username,
                _emailOptions.Password,
                cancellationToken);

            // Send message
            await client.SendAsync(message, cancellationToken);

            // Disconnect
            await client.DisconnectAsync(true, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "SMTP error occurred while sending email");
            throw new EmailServiceException("Failed to send email via SMTP service.", ex);
        }
    }
    private static string ConvertHtmlToPlainText(string html)
    {
        // Remove HTML tags
        var plainText = System.Text.RegularExpressions.Regex.Replace(html, "<[^>]*>", "");
        // Decode HTML entities
        plainText = System.Net.WebUtility.HtmlDecode(plainText);
        return plainText;
    }
}
