using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Infrastructure.Configuration;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;

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

            var htmlBody = GenerateWelcomeEmailHtml(recipientName);
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

            var htmlBody = GeneratePasswordResetEmailHtml(recipientName, resetLink);
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

            var htmlBody = GenerateEmailConfirmationHtml(recipientName, confirmationLink);
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

    #region Email Template Generation

    private static string GenerateWelcomeEmailHtml(string recipientName)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; }}
        .content {{ padding: 20px; background: #f9f9f9; border-radius: 5px; margin-top: 20px; }}
        .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; }}
        .button {{ display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>Welcome to ThinkTogether!</h1>
        </div>
        <div class=""content"">
            <p>Hi {recipientName},</p>
            <p>Thank you for registering with ThinkTogether! We're excited to have you on board.</p>
            <p>ThinkTogether is an interactive quiz platform designed to make learning engaging and fun. Create custom quizzes, challenge friends, and track your progress all in one place.</p>
            <p><strong>What you can do now:</strong></p>
            <ul>
                <li>Create your own quiz sets</li>
                <li>Host live games and invite others</li>
                <li>Track your performance and statistics</li>
                <li>Compete with friends and colleagues</li>
            </ul>
            <p>Get started by logging in to your account and creating your first quiz!</p>
        </div>
        <div class=""footer"">
            <p>© 2025 ThinkTogether. All rights reserved.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
    </div>
</body>
</html>";
    }

    private static string GeneratePasswordResetEmailHtml(string recipientName, string resetLink)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #ff6b6b; color: white; padding: 20px; border-radius: 5px; text-align: center; }}
        .content {{ padding: 20px; background: #f9f9f9; border-radius: 5px; margin-top: 20px; }}
        .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; }}
        .button {{ display: inline-block; padding: 10px 20px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
        .warning {{ color: #ff6b6b; font-weight: bold; }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>Reset Your Password</h1>
        </div>
        <div class=""content"">
            <p>Hi {recipientName},</p>
            <p>We received a request to reset your ThinkTogether password. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <a href=""{resetLink}"" class=""button"">Reset Password</a>
            <p><span class=""warning"">⚠️ This link will expire in 1 hour.</span></p>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p><code>{resetLink}</code></p>
        </div>
        <div class=""footer"">
            <p>© 2025 ThinkTogether. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
    }

    private static string GenerateEmailConfirmationHtml(string recipientName, string confirmationLink)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; }}
        .content {{ padding: 20px; background: #f9f9f9; border-radius: 5px; margin-top: 20px; }}
        .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; }}
        .button {{ display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>Confirm Your Email</h1>
        </div>
        <div class=""content"">
            <p>Hi {recipientName},</p>
            <p>Welcome to ThinkTogether! Please confirm your email address to complete your registration.</p>
            <p>Click the button below to confirm your email:</p>
            <a href=""{confirmationLink}"" class=""button"">Confirm Email</a>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p><code>{confirmationLink}</code></p>
        </div>
        <div class=""footer"">
            <p>© 2025 ThinkTogether. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
    }

    private static string ConvertHtmlToPlainText(string html)
    {
        // Remove HTML tags
        var plainText = System.Text.RegularExpressions.Regex.Replace(html, "<[^>]*>", "");
        // Decode HTML entities
        plainText = System.Net.WebUtility.HtmlDecode(plainText);
        return plainText;
    }

    #endregion
}
