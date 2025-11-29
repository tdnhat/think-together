using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using Shared.Primitives;

namespace ThinkTogether.Application.Interfaces;

public interface IQuizSetRepository : IRepository<QuizSet, Guid>
{
    Task<List<QuizSet>> GetByCreatorIdAsync(Guid creatorId, CancellationToken cancellationToken = default);
    Task<List<QuizSet>> GetPublishedAsync(CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    IQueryable<QuizSet> GetByCreatorIdQueryable(Guid creatorId);
}

