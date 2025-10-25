using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Domain.Aggregates.UserAggregate.Events;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;

namespace ThinkTogether.Application.DomainEventHandlers.User;

public class EmailConfirmedDomainEventHandler : INotificationHandler<EmailConfirmedDomainEvent>
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailConfirmedDomainEventHandler> _logger;

    public EmailConfirmedDomainEventHandler(
        IEmailService emailService,
        ILogger<EmailConfirmedDomainEventHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(EmailConfirmedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing email confirmed event for user {UserId}", notification.UserId);

            await _emailService.SendWelcomeEmailAsync(
                notification.Email,
                notification.FullName,
                cancellationToken);

            _logger.LogInformation("Welcome email sent successfully to {Email} for user {UserId}", notification.Email, notification.UserId);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Welcome email sending was cancelled for user {UserId}", notification.UserId);
            throw new OperationCanceledException($"Welcome email sending operation was cancelled for user {notification.UserId}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send welcome email to {Email} for user {UserId}", notification.Email, notification.UserId);
            throw new InvalidOperationException($"Failed to send welcome email for user {notification.UserId}", ex);
        }
    }
}
