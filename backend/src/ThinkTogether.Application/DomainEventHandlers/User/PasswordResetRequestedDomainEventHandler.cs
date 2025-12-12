using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Domain.Aggregates.UserAggregate.Events;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Domain.Exceptions;

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
            throw new ValidationException($"Gửi email đặt lại mật khẩu bị hủy cho người dùng {notification.UserId}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset email to {Email} for user {UserId}", notification.Email, notification.UserId);
            throw new ValidationException($"Không thể gửi email đặt lại mật khẩu cho người dùng {notification.UserId}", ex);
        }
    }
}
