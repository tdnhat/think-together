using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Events;

public class EmailConfirmationRequestedDomainEvent : IDomainEvent
{
    public Guid UserId { get; }
    public string Email { get; }
    public string FullName { get; }
    public string ConfirmationToken { get; }
    public string ConfirmationLink { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public EmailConfirmationRequestedDomainEvent(
        Guid userId, 
        string email, 
        string fullName, 
        string confirmationToken, 
        string confirmationLink)
    {
        UserId = userId;
        Email = email;
        FullName = fullName;
        ConfirmationToken = confirmationToken;
        ConfirmationLink = confirmationLink;
    }
}
