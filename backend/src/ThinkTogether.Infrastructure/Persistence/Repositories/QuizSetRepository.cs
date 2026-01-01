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
            .Include(q => q.Questions.Where(question => question.DeletedAt == null))
            .ToListAsync(cancellationToken);
    }

    public async Task<(List<QuizSet> Items, int TotalCount)> GetBySpecificationAsync(
        Specification<QuizSet> spec,
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

    public async Task<int> CountQuestionsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Questions
            .Where(q => q.DeletedAt == null)
            .Join(
                _context.QuizSets.Where(qs => qs.DeletedAt == null),
                question => question.QuizSetId,
                quizSet => quizSet.Id,
                (question, quizSet) => question
            )
            .CountAsync(cancellationToken);
    }

    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.QuizSets.CountAsync(cancellationToken);
    }

    public async Task<int> CountCreatedAfterAsync(DateTime date, CancellationToken cancellationToken = default)
    {
        return await _context.QuizSets.CountAsync(q => q.CreatedAt >= date, cancellationToken);
    }

    public async Task<Dictionary<DateTime, int>> GetCreationStatsAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        var stats = await _context.QuizSets
            .Where(q => q.CreatedAt >= from && q.CreatedAt <= to)
            .GroupBy(q => new { q.CreatedAt.Year, q.CreatedAt.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Count = g.Count() })
            .ToListAsync(cancellationToken);

        return stats.ToDictionary(k => new DateTime(k.Year, k.Month, 1), v => v.Count);
    }

    public async Task<Dictionary<string, int>> GetCountsByCategoryAsync(CancellationToken cancellationToken = default)
    {
        // Join with Categories to get names
        var query = from q in _context.QuizSets
                    where q.CategoryId.HasValue
                    join c in _context.Categories on q.CategoryId equals c.Id
                    group q by c.Name into g
                    select new { CategoryName = g.Key, Count = g.Count() };
                    
        var result = await query.ToListAsync(cancellationToken);
        return result.ToDictionary(k => k.CategoryName, v => v.Count);
    }
}

