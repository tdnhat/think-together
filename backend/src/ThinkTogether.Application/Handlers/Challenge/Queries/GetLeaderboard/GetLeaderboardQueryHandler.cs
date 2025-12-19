using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetLeaderboard;

public sealed class GetLeaderboardQueryHandler : IRequestHandler<GetLeaderboardQuery, ChallengeLeaderboardDto>
{
    private readonly IChallengeRepository _challengeRepository;

    public GetLeaderboardQueryHandler(IChallengeRepository challengeRepository)
    {
        _challengeRepository = challengeRepository;
    }

    public async Task<ChallengeLeaderboardDto> Handle(GetLeaderboardQuery request, CancellationToken cancellationToken)
    {
        var challenge = await _challengeRepository.GetByIdAsync(request.ChallengeId, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.ChallengeId);

        if (!challenge.ShowLeaderboard)
            throw new ForbiddenException("Bảng xếp hạng không được hiển thị cho thử thách này");

        // Get completed attempts only, ordered by score (desc), then by completion time (asc), then by completed date (asc)
        var completedAttempts = challenge.Attempts
            .Where(a => a.Status == AttemptStatus.Completed && a.DeletedAt == null)
            .OrderByDescending(a => a.ScoreAchieved)
            .ThenBy(a => a.CompletionTimeMs ?? int.MaxValue)
            .ThenBy(a => a.CompletedAt)
            .ToList();

        var totalEntries = completedAttempts.Count;
        var totalPages = (int)Math.Ceiling((double)totalEntries / request.PageSize);
        var skip = (request.Page - 1) * request.PageSize;
        var pagedAttempts = completedAttempts.Skip(skip).Take(request.PageSize).ToList();

        var entries = pagedAttempts.Select((attempt, index) => new ChallengeLeaderboardEntryDto
        {
            AttemptId = attempt.Id,
            UserId = attempt.UserId,
            Nickname = attempt.Nickname,
            Score = attempt.ScoreAchieved,
            CorrectAnswers = attempt.CorrectAnswers,
            TotalQuestions = attempt.TotalQuestions,
            CompletionTimeMs = attempt.CompletionTimeMs,
            CompletedAt = attempt.CompletedAt,
            Rank = skip + index + 1
        }).ToList();

        return new ChallengeLeaderboardDto
        {
            ChallengeId = challenge.Id,
            Entries = entries,
            TotalEntries = totalEntries,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = totalPages
        };
    }
}
