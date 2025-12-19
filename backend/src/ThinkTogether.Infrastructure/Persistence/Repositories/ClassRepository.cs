using ThinkTogether.Domain.Aggregates.ClassAggregate;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class ClassRepository : Repository<Class, Guid>, IClassRepository
{
    public ClassRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Class?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.Id == id && c.DeletedAt == null)
            .Include(c => c.Members)
            .Include(c => c.Homeworks)
                .ThenInclude(h => h.Submissions)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Class?> GetByJoinCodeAsync(string joinCode, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.DeletedAt == null)
            .Include(c => c.Members.Where(m => m.LeftAt == null))
            .Include(c => c.Homeworks.Where(h => h.DeletedAt == null))
                .ThenInclude(h => h.Submissions)
            .FirstOrDefaultAsync(c => c.JoinCode == joinCode, cancellationToken);
    }

    public async Task<List<Class>> GetByTeacherIdAsync(Guid teacherId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.TeacherId == teacherId && c.DeletedAt == null)
            .Include(c => c.Members.Where(m => m.LeftAt == null))
            .Include(c => c.Homeworks.Where(h => h.DeletedAt == null))
                .ThenInclude(h => h.Submissions)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Class>> GetByMemberIdAsync(Guid memberId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.DeletedAt == null && c.Members.Any(m => m.UserId == memberId && m.LeftAt == null))
            .Include(c => c.Members.Where(m => m.LeftAt == null))
            .Include(c => c.Homeworks.Where(h => h.DeletedAt == null))
                .ThenInclude(h => h.Submissions)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
