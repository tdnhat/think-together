using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Specifications;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
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

    public async Task<List<QuizSet>> GetByCreatorIdAsync(Guid creatorId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(q => q.CreatorId == creatorId && q.DeletedAt == null)
            .Include(q => q.Questions)
            .OrderByDescending(q => q.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public IQueryable<QuizSet> GetByCreatorIdQueryable(Guid creatorId)
    {
        return _dbSet
            .Where(q => q.CreatorId == creatorId && q.DeletedAt == null)
            .Include(q => q.Questions);
    }

    public async Task<List<QuizSet>> GetPublishedAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(q => q.IsPublished && q.DeletedAt == null)
            .Include(q => q.Questions)
            .OrderByDescending(q => q.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var quizSet = await GetByIdAsync(id, cancellationToken);
        if (quizSet != null)
        {
            quizSet.Delete();
            await base.UpdateAsync(quizSet, cancellationToken);
            await SaveChangesAsync(cancellationToken);
        }
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
}

