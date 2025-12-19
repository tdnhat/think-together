using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

public interface IQuizSetRepository : IRepository<QuizSet, Guid>
{
    Task<List<QuizSet>> GetByCreatorIdAsync(Guid creatorId, CancellationToken cancellationToken = default);
    Task<List<QuizSet>> GetPublishedAsync(CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    IQueryable<QuizSet> GetByCreatorIdQueryable(Guid creatorId);
    Task<List<QuizSet>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default);
}

