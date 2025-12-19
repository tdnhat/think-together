using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class ChallengeRepository : Repository<Challenge, Guid>, IChallengeRepository
{
    public ChallengeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Challenge?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.Id == id && c.DeletedAt == null)
            .Include(c => c.Attempts.Where(a => a.DeletedAt == null))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<(ChallengeAttempt Attempt, Challenge Challenge)>> GetCompletedAttemptsWithChallengesAsync(
        Guid? quizSetId = null,
        Guid? challengeId = null,
        DateTime? completedAfter = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.ChallengeAttempts
            .Where(a => a.Status == AttemptStatus.Completed && a.DeletedAt == null)
            .Join(
                _context.Challenges.Where(c => c.DeletedAt == null),
                attempt => attempt.ChallengeId,
                challenge => challenge.Id,
                (attempt, challenge) => new { Attempt = attempt, Challenge = challenge }
            );

        if (quizSetId.HasValue)
        {
            query = query.Where(x => x.Challenge.QuizSetId == quizSetId.Value);
        }

        if (challengeId.HasValue)
        {
            query = query.Where(x => x.Challenge.Id == challengeId.Value);
        }

        if (completedAfter.HasValue)
        {
            query = query.Where(x => x.Attempt.CompletedAt >= completedAfter.Value);
        }

        var results = await query.ToListAsync(cancellationToken);
        return results.Select(x => (x.Attempt, x.Challenge)).ToList();
    }

    public async Task<List<ChallengeAttempt>> GetAttemptsWithChallengesAsync(
        Guid? quizSetId = null,
        Guid? challengeId = null,
        DateTime? startedAfter = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.ChallengeAttempts
            .Where(a => a.DeletedAt == null)
            .Join(
                _context.Challenges.Where(c => c.DeletedAt == null),
                attempt => attempt.ChallengeId,
                challenge => challenge.Id,
                (attempt, challenge) => new { Attempt = attempt, Challenge = challenge }
            );

        if (quizSetId.HasValue)
        {
            query = query.Where(x => x.Challenge.QuizSetId == quizSetId.Value);
        }

        if (challengeId.HasValue)
        {
            query = query.Where(x => x.Challenge.Id == challengeId.Value);
        }

        if (startedAfter.HasValue)
        {
            query = query.Where(x => x.Attempt.StartedAt >= startedAfter.Value);
        }

        var results = await query.ToListAsync(cancellationToken);
        return results.Select(x => x.Attempt).ToList();
    }
}
