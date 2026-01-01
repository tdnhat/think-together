using Shared.Primitives;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

public interface IQuizSetRepository : IRepository<QuizSet, Guid>
{
    Task<List<QuizSet>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default);
    
    Task<(List<QuizSet> Items, int TotalCount)> GetBySpecificationAsync(
        Specification<QuizSet> spec, 
        CancellationToken cancellationToken = default);
    
    Task<int> CountQuestionsAsync(CancellationToken cancellationToken = default);

    Task<int> CountAsync(CancellationToken cancellationToken = default);

    Task<int> CountCreatedAfterAsync(DateTime date, CancellationToken cancellationToken = default);

    Task<Dictionary<DateTime, int>> GetCreationStatsAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default);

    Task<Dictionary<string, int>> GetCountsByCategoryAsync(CancellationToken cancellationToken = default);
}

