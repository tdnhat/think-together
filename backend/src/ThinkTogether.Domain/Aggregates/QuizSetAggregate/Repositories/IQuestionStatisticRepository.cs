using Shared.Primitives;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

public interface IQuestionStatisticRepository : IRepository<QuestionStatistic, Guid>
{
    Task<QuestionStatistic?> GetByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken = default);

    Task<List<QuestionStatistic>> GetByQuestionIdsAsync(List<Guid> questionIds, CancellationToken cancellationToken = default);
}
