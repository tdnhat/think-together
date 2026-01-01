using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using ThinkTogether.Domain.Aggregates.UserAggregate;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Specifications;
using Shared.Primitives;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class UserRepository : Repository<User, Guid>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<User>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default)
    {
        if (ids == null || ids.Count == 0)
        {
            return new List<User>();
        }

        return await _dbSet
            .Where(u => ids.Contains(u.Id) && u.DeletedAt == null)
            .ToListAsync(cancellationToken);
    }

    public async Task<(List<User> Items, int TotalCount)> GetBySpecificationAsync(
        Specification<User> spec,
        CancellationToken cancellationToken = default)
    {
        // Get total count before pagination
        var queryWithoutPaging = ApplySpecificationWithoutPaging(spec).AsNoTracking();
        var totalCount = await queryWithoutPaging.CountAsync(cancellationToken);

        // Get paginated results
        var queryWithPaging = ApplySpecification(spec).AsNoTracking();
        var items = await queryWithPaging.ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Users.CountAsync(cancellationToken);
    }

    public async Task<int> CountCreatedAfterAsync(DateTime date, CancellationToken cancellationToken = default)
    {
        return await _context.Users.CountAsync(u => u.CreatedAt >= date, cancellationToken);
    }

    public async Task<Dictionary<DateTime, int>> GetCreationStatsAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        var stats = await _context.Users
            .Where(u => u.CreatedAt >= from && u.CreatedAt <= to)
            .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Count = g.Count() })
            .ToListAsync(cancellationToken);

        return stats.ToDictionary(k => new DateTime(k.Year, k.Month, 1), v => v.Count);
    }

    private IQueryable<User> ApplySpecificationWithoutPaging(Specification<User> spec)
    {
        var query = _dbSet.AsQueryable();

        query = query.Where(spec.Criteria);

        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

        query = spec.IncludeStrings.Aggregate(query, (current, include) => current.Include(include));

        if (spec.OrderBy != null)
            query = query.OrderBy(spec.OrderBy);

        if (spec.OrderByDescending != null)
            query = query.OrderByDescending(spec.OrderByDescending);

        return query;
    }
}
