using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Events;

public class EmailConfirmedDomainEvent : IDomainEvent
{
    public Guid UserId { get; }
    public string Email { get; }
    public string FullName { get; }
    public DateTime OccurredOn => DateTime.UtcNow;

    public EmailConfirmedDomainEvent(Guid userId, string email, string fullName)
    {
        UserId = userId;
        Email = email;
        FullName = fullName;
    }
}
