using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class QuestionStatisticRepository : Repository<QuestionStatistic, Guid>, IQuestionStatisticRepository
{
    public QuestionStatisticRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<QuestionStatistic?> GetByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(qs => qs.QuestionId == questionId, cancellationToken);
    }

    public async Task<List<QuestionStatistic>> GetByQuestionIdsAsync(List<Guid> questionIds, CancellationToken cancellationToken = default)
    {
        if (questionIds == null || questionIds.Count == 0)
        {
            return new List<QuestionStatistic>();
        }

        return await _dbSet
            .Where(qs => questionIds.Contains(qs.QuestionId))
            .ToListAsync(cancellationToken);
    }
}
