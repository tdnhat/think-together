using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Domain.Aggregates.UserAggregate.Events;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;

namespace ThinkTogether.Application.DomainEventHandlers.User;

public class PasswordResetRequestedDomainEventHandler : INotificationHandler<PasswordResetRequestedDomainEvent>
{
    private readonly IEmailService _emailService;
    private readonly ILogger<PasswordResetRequestedDomainEventHandler> _logger;

    public PasswordResetRequestedDomainEventHandler(
        IEmailService emailService,
        ILogger<PasswordResetRequestedDomainEventHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(PasswordResetRequestedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing password reset request event for user {UserId}", notification.UserId);

            await _emailService.SendPasswordResetEmailAsync(
                notification.Email,
                notification.FullName,
                notification.ResetToken,
                notification.ResetLink,
                cancellationToken);

            _logger.LogInformation("Password reset email sent successfully to {Email} for user {UserId}", notification.Email, notification.UserId);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Password reset email sending was cancelled for user {UserId}", notification.UserId);
            throw new OperationCanceledException($"Password reset email sending operation was cancelled for user {notification.UserId}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset email to {Email} for user {UserId}", notification.Email, notification.UserId);
            throw new InvalidOperationException($"Failed to send password reset email for user {notification.UserId}", ex);
        }
    }
}
