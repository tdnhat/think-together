namespace Shared.Primitives;

public abstract class Entity
{
    private readonly List<IDomainEvent> _domainEvents = new();

    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; protected set; } = DateTime.UtcNow;

    public DateTime? DeletedAt { get; protected set; }

    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    public bool IsDeleted => DeletedAt.HasValue;

    public virtual void Delete()
    {
        DeletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public virtual void Restore()
    {
        DeletedAt = null;
        UpdatedAt = DateTime.UtcNow;
    }

    protected void Touch()
    {
        UpdatedAt = DateTime.UtcNow;
    }

    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    protected void RemoveDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Remove(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}

