using ThinkTogether.Domain.Aggregates.ClassAggregate;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Specifications;
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
            .Include(c => c.Members.Where(m => m.LeftAt == null))
            .Include(c => c.Homeworks.Where(h => h.DeletedAt == null))
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


    public async Task<Homework?> GetHomeworkByQuizSetIdAsync(Guid quizSetId, CancellationToken cancellationToken = default)
    {
        var classEntity = await _dbSet
            .Where(c => c.DeletedAt == null)
            .Include(c => c.Homeworks.Where(h => h.DeletedAt == null))
            .FirstOrDefaultAsync(c => c.Homeworks.Any(h => h.QuizSetId == quizSetId && h.DeletedAt == null), cancellationToken);

        return classEntity?.Homeworks.FirstOrDefault(h => h.QuizSetId == quizSetId && h.DeletedAt == null);
    }

    public async Task<(Class Class, Homework Homework)?> GetClassAndHomeworkByHomeworkIdAsync(Guid homeworkId, CancellationToken cancellationToken = default)
    {
        var classEntity = await _dbSet
            .Where(c => c.DeletedAt == null)
            .Include(c => c.Homeworks.Where(h => h.DeletedAt == null))
                .ThenInclude(h => h.Submissions)
            .FirstOrDefaultAsync(c => c.Homeworks.Any(h => h.Id == homeworkId && h.DeletedAt == null), cancellationToken);

        if (classEntity == null)
            return null;

        var homework = classEntity.Homeworks.FirstOrDefault(h => h.Id == homeworkId && h.DeletedAt == null);
        if (homework == null)
            return null;

        return (classEntity, homework);
    }

    public async Task<List<(HomeworkSubmission Submission, Homework Homework, Class Class)>> GetHomeworkSubmissionsByAttemptIdsAsync(List<Guid> attemptIds, CancellationToken cancellationToken = default)
    {
        if (attemptIds == null || attemptIds.Count == 0)
        {
            return new List<(HomeworkSubmission, Homework, Class)>();
        }

        // Load all classes with homeworks and submissions
        var classes = await _dbSet
            .Where(c => c.DeletedAt == null)
            .Include(c => c.Homeworks.Where(h => h.DeletedAt == null))
                .ThenInclude(h => h.Submissions)
            .ToListAsync(cancellationToken);

        var results = new List<(HomeworkSubmission, Homework, Class)>();

        foreach (var classEntity in classes)
        {
            foreach (var homework in classEntity.Homeworks.Where(h => h.DeletedAt == null))
            {
                foreach (var submission in homework.Submissions)
                {
                    if (attemptIds.Contains(submission.ChallengeAttemptId))
                    {
                        results.Add((submission, homework, classEntity));
                    }
                }
            }
        }

        return results;
    }
}
