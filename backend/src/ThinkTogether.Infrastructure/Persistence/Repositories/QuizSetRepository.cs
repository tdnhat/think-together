using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Shared.Primitives;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class QuizSetRepository : Repository<QuizSet, Guid>, IQuizSetRepository
{
    public QuizSetRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<QuizSet?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var spec = new QuizSetByIdWithQuestionsSpecification(id);
        return await GetBySpecAsync(spec, cancellationToken);
    }

    public async Task<List<QuizSet>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default)
    {
        if (ids == null || ids.Count == 0)
        {
            return new List<QuizSet>();
        }

        return await _dbSet
            .Where(q => ids.Contains(q.Id) && q.DeletedAt == null)
            .ToListAsync(cancellationToken);
    }

    public async Task<(List<QuizSet> Items, int TotalCount)> GetBySpecificationAsync(
        Specification<QuizSet> spec,
        CancellationToken cancellationToken = default)
    {
        // Get total count before pagination
        var queryWithoutPaging = ApplySpecificationWithoutPaging(spec);
        var totalCount = await queryWithoutPaging.CountAsync(cancellationToken);

        // Get paginated results
        var queryWithPaging = ApplySpecification(spec);
        var items = await queryWithPaging.ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    private IQueryable<QuizSet> ApplySpecificationWithoutPaging(Specification<QuizSet> spec)
    {
        var query = _dbSet.AsQueryable();

        query = query.Where(spec.Criteria);

        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

        query = spec.IncludeStrings.Aggregate(query, (current, include) => current.Include(include));

        if (spec.OrderBy != null)
            query = query.OrderBy(spec.OrderBy);

        if (spec.OrderByDescending != null)
            query = query.OrderByDescending(spec.OrderByDescending);

        // Don't apply pagination here - we need the total count

        return query;
    }
}

