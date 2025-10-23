namespace Shared.Primitives;

public interface IDomainEvent
{
    DateTime OccurredOn { get; }
}

