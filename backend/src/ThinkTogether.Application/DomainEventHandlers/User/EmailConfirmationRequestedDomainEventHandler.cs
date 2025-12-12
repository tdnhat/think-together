using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Domain.Aggregates.UserAggregate.Events;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.DomainEventHandlers.User;

public class EmailConfirmationRequestedDomainEventHandler : INotificationHandler<EmailConfirmationRequestedDomainEvent>
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailConfirmationRequestedDomainEventHandler> _logger;

    public EmailConfirmationRequestedDomainEventHandler(
        IEmailService emailService,
        ILogger<EmailConfirmationRequestedDomainEventHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(EmailConfirmationRequestedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing email confirmation request event for user {UserId}", notification.UserId);

            await _emailService.SendEmailConfirmationEmailAsync(
                notification.Email,
                notification.FullName,
                notification.ConfirmationToken,
                notification.ConfirmationLink,
                cancellationToken);

            _logger.LogInformation("Email confirmation email sent successfully to {Email} for user {UserId}", notification.Email, notification.UserId);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Email confirmation email sending was cancelled for user {UserId}", notification.UserId);
            throw new ValidationException($"Gửi email xác nhận bị hủy cho người dùng {notification.UserId}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email confirmation email to {Email} for user {UserId}", notification.Email, notification.UserId);
            throw new ValidationException($"Không thể gửi email xác nhận cho người dùng {notification.UserId}", ex);
        }
    }
}
