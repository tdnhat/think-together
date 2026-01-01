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
}

