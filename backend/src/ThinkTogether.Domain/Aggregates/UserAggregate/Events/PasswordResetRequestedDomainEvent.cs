using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Events;

public class PasswordResetRequestedDomainEvent : IDomainEvent
{
    public Guid UserId { get; }
    public string Email { get; }
    public string FullName { get; }
    public string ResetToken { get; }
    public string ResetLink { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public PasswordResetRequestedDomainEvent(
        Guid userId, 
        string email, 
        string fullName, 
        string resetToken, 
        string resetLink)
    {
        UserId = userId;
        Email = email;
        FullName = fullName;
        ResetToken = resetToken;
        ResetLink = resetLink;
    }
}
