using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Shared.Primitives;

namespace ThinkTogether.Infrastructure.Persistence.Interceptors;

public class AuditInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        ApplyAuditTrail(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyAuditTrail(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private static void ApplyAuditTrail(DbContext? context)
    {
        if (context is null)
            return;

        var entries = context.ChangeTracker.Entries<Entity>().ToList();

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    ApplyCreationAudit(entry);
                    break;

                case EntityState.Modified:
                    ApplyModificationAudit(entry);
                    break;

                case EntityState.Deleted:
                    ApplySoftDeleteAudit(entry);
                    break;
            }
        }
    }

    private static void ApplyCreationAudit(EntityEntry<Entity> entry)
    {
        var now = DateTime.UtcNow;

        // Set creation timestamp
        entry.Property(e => e.CreatedAt).CurrentValue = now;

        // Set update timestamp to same value
        entry.Property(e => e.UpdatedAt).CurrentValue = now;

        // Ensure DeletedAt is null (IsDeleted will be computed as false)
        entry.Property(e => e.DeletedAt).CurrentValue = null;
    }

    private static void ApplyModificationAudit(EntityEntry<Entity> entry)
    {
        var now = DateTime.UtcNow;

        // Update modification timestamp
        entry.Property(e => e.UpdatedAt).CurrentValue = now;

        // Don't update CreatedAt - it should remain unchanged
        entry.Property(e => e.CreatedAt).IsModified = false;

        // Don't modify DeletedAt unless intentional
        entry.Property(e => e.DeletedAt).IsModified = false;
    }

    private static void ApplySoftDeleteAudit(EntityEntry<Entity> entry)
    {
        var now = DateTime.UtcNow;

        // Don't actually delete - update soft delete properties instead
        entry.State = EntityState.Modified;

        // Set deletion timestamp (IsDeleted will be computed as true)
        entry.Property(e => e.DeletedAt).CurrentValue = now;

        // Update modification timestamp
        entry.Property(e => e.UpdatedAt).CurrentValue = now;
    }
}
