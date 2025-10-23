using Domain.Aggregates.QuizSetAggregate;
using Domain.Aggregates.QuizSetAggregate.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class QuizSetRepository : Repository<QuizSet, Guid>, IQuizSetRepository
{
    public QuizSetRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<QuizSet>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(q => q.UserId == userId && q.DeletedAt == null)
            .OrderByDescending(q => q.UpdatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<QuizSet>> GetPublishedAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(q => q.IsPublished && q.DeletedAt == null)
            .OrderBy(q => q.DisplayOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}
