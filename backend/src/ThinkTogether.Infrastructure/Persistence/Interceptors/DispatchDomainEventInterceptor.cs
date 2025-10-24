using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Shared.Primitives;

namespace ThinkTogether.Infrastructure.Persistence.Interceptors;

public class DispatchDomainEventInterceptor(IPublisher publisher) : SaveChangesInterceptor
{
    public override int SavedChanges(SaveChangesCompletedEventData eventData, int result)
    {
        var baseResult = base.SavedChanges(eventData, result);
        DispatchDomainEvents(eventData.Context);
        return baseResult;
    }

    public override async ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken cancellationToken = default)
    {
        var baseResult = await base.SavedChangesAsync(eventData, result, cancellationToken);
        await DispatchDomainEventsAsync(eventData.Context, cancellationToken);
        return baseResult;
    }

    private void DispatchDomainEvents(DbContext? context)
    {
        if (context is null)
            return;

        // Get all aggregate roots that have domain events
        var aggregateRoots = context.ChangeTracker
            .Entries<AggregateRoot>()
            .Where(entry => entry.Entity.DomainEvents.Count > 0)
            .Select(entry => entry.Entity)
            .ToList();

        // Collect all domain events
        var domainEvents = aggregateRoots
            .SelectMany(aggregateRoot => aggregateRoot.DomainEvents)
            .ToList();

        // Clear domain events from aggregate roots
        foreach (var aggregateRoot in aggregateRoots)
        {
            aggregateRoot.ClearDomainEvents();
        }

        // Dispatch each domain event through MediatR
        foreach (var domainEvent in domainEvents)
        {
            publisher.Publish(domainEvent).GetAwaiter().GetResult();
        }
    }

    private async Task DispatchDomainEventsAsync(DbContext? context, CancellationToken cancellationToken)
    {
        if (context is null)
            return;

        // Get all aggregate roots that have domain events
        var aggregateRoots = context.ChangeTracker
            .Entries<AggregateRoot>()
            .Where(entry => entry.Entity.DomainEvents.Count > 0)
            .Select(entry => entry.Entity)
            .ToList();

        // Collect all domain events
        var domainEvents = aggregateRoots
            .SelectMany(aggregateRoot => aggregateRoot.DomainEvents)
            .ToList();

        // Clear domain events from aggregate roots
        foreach (var aggregateRoot in aggregateRoots)
        {
            aggregateRoot.ClearDomainEvents();
        }

        // Dispatch each domain event through MediatR asynchronously
        foreach (var domainEvent in domainEvents)
        {
            await publisher.Publish(domainEvent, cancellationToken);
        }
    }
}
