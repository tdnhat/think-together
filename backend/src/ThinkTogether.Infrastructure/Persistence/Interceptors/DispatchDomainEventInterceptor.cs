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

        // Get all entities that have domain events
        var entities = context.ChangeTracker
            .Entries<Entity>()
            .Where(entry => entry.Entity.DomainEvents.Count > 0)
            .Select(entry => entry.Entity)
            .ToList();

        // Collect all domain events
        var domainEvents = entities
            .SelectMany(entity => entity.DomainEvents)
            .ToList();

        // Clear domain events from entities
        foreach (var entity in entities)
        {
            entity.ClearDomainEvents();
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

        // Get all entities that have domain events
        var entities = context.ChangeTracker
            .Entries<Entity>()
            .Where(entry => entry.Entity.DomainEvents.Count > 0)
            .Select(entry => entry.Entity)
            .ToList();

        // Collect all domain events
        var domainEvents = entities
            .SelectMany(entity => entity.DomainEvents)
            .ToList();

        // Clear domain events from entities
        foreach (var entity in entities)
        {
            entity.ClearDomainEvents();
        }

        // Dispatch each domain event through MediatR asynchronously
        foreach (var domainEvent in domainEvents)
        {
            await publisher.Publish(domainEvent, cancellationToken);
        }
    }
}
