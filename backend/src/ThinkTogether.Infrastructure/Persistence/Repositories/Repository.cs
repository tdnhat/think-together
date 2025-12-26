using Microsoft.EntityFrameworkCore;
using Shared.Primitives;
using ThinkTogether.Infrastructure.Persistence;

namespace Infrastructure.Persistence.Repositories;

public abstract class Repository<TAggregate, TId> : IRepository<TAggregate, TId>
    where TAggregate : AggregateRoot
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<TAggregate> _dbSet;

    protected Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TAggregate>();
    }

    public virtual async Task<TAggregate?> GetByIdAsync(TId id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(e => EF.Property<TId>(e, "Id")!.Equals(id), cancellationToken);
    }

    public virtual async Task<IEnumerable<TAggregate>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
    }

    public virtual async Task<TAggregate?> GetBySpecAsync(Specification<TAggregate> spec, CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(spec).FirstOrDefaultAsync(cancellationToken);
    }

    public virtual async Task<IEnumerable<TAggregate>> FindAsync(
        Func<TAggregate, bool> specification,
        CancellationToken cancellationToken = default)
    {
        return await Task.FromResult(_dbSet.AsNoTracking().Where(specification).ToList());
    }

    public virtual async Task<TAggregate?> FindOneAsync(
        Func<TAggregate, bool> specification,
        CancellationToken cancellationToken = default)
    {
        return await Task.FromResult(_dbSet.AsNoTracking().FirstOrDefault(specification));
    }

    public virtual async Task<bool> AnyAsync(
        Func<TAggregate, bool> specification,
        CancellationToken cancellationToken = default)
    {
        return await Task.FromResult(_dbSet.Any(specification));
    }

    public virtual async Task<int> CountAsync(
        Func<TAggregate, bool>? specification = null,
        CancellationToken cancellationToken = default)
    {
        if (specification == null)
            return await _dbSet.CountAsync(cancellationToken);

        return await Task.FromResult(_dbSet.Count(specification));
    }

    public virtual async Task AddAsync(TAggregate aggregate, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(aggregate, cancellationToken);
    }

    public virtual async Task UpdateAsync(TAggregate aggregate, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(aggregate);
        await Task.CompletedTask;
    }

    public virtual async Task DeleteAsync(TAggregate aggregate, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(aggregate);
        await Task.CompletedTask;
    }

    protected virtual IQueryable<TAggregate> ApplySpecification(Specification<TAggregate> spec)
    {
        var query = _dbSet.AsQueryable();

        query = query.Where(spec.Criteria);

        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

        query = spec.IncludeStrings.Aggregate(query, (current, include) => current.Include(include));

        if (spec.OrderBy != null)
            query = query.OrderBy(spec.OrderBy);

        if (spec.OrderByDescending != null)
            query = query.OrderByDescending(spec.OrderByDescending);

        if (spec.IsPagingEnabled)
            query = query.Skip(spec.Skip).Take(spec.Take);

        return query;
    }
}
