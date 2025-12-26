using Shared.Primitives;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

public interface IQuizSetRepository : IRepository<QuizSet, Guid>
{
    /// <summary>
    /// Batch get quiz sets by IDs
    /// </summary>
    Task<List<QuizSet>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get paginated results using specification with total count
    /// </summary>
    Task<(List<QuizSet> Items, int TotalCount)> GetBySpecificationAsync(
        Specification<QuizSet> spec, 
        CancellationToken cancellationToken = default);
}

