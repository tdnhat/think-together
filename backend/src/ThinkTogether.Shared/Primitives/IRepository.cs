namespace Shared.Primitives;

public interface IRepository<TAggregate, in TId> 
    where TAggregate : AggregateRoot
{
    Task<TAggregate?> GetByIdAsync(TId id, CancellationToken cancellationToken = default);

    Task<IEnumerable<TAggregate>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<TAggregate?> GetBySpecAsync(Specification<TAggregate> spec, CancellationToken cancellationToken = default);

    Task<IEnumerable<TAggregate>> FindAsync(
        Func<TAggregate, bool> specification, 
        CancellationToken cancellationToken = default);

    Task<TAggregate?> FindOneAsync(
        Func<TAggregate, bool> specification, 
        CancellationToken cancellationToken = default);

    Task<bool> AnyAsync(
        Func<TAggregate, bool> specification, 
        CancellationToken cancellationToken = default);

    Task<int> CountAsync(
        Func<TAggregate, bool>? specification = null, 
        CancellationToken cancellationToken = default);

    Task AddAsync(TAggregate aggregate, CancellationToken cancellationToken = default);

    Task UpdateAsync(TAggregate aggregate, CancellationToken cancellationToken = default);

    Task DeleteAsync(TAggregate aggregate, CancellationToken cancellationToken = default);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

