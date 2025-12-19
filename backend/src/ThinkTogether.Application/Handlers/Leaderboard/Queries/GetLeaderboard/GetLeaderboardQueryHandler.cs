using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.Handlers.Leaderboard.Queries.GetLeaderboard;

public sealed class GetLeaderboardQueryHandler : IRequestHandler<GetLeaderboardQuery, LeaderboardDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IClassRepository _classRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetLeaderboardQueryHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        IClassRepository classRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _classRepository = classRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<LeaderboardDto> Handle(GetLeaderboardQuery request, CancellationToken cancellationToken)
    {
        // Calculate cutoff date for time period filter
        DateTime? completedAfter = null;
        if (!string.IsNullOrEmpty(request.TimePeriod) && request.TimePeriod != "all")
        {
            completedAfter = request.TimePeriod switch
            {
                "today" => DateTime.UtcNow.Date,
                "week" => DateTime.UtcNow.AddDays(-7),
                "month" => DateTime.UtcNow.AddMonths(-1),
                _ => null
            };
        }

        // Get completed attempts with challenges using repository method
        var allAttemptsData = await _challengeRepository.GetCompletedAttemptsWithChallengesAsync(
            quizSetId: request.QuizSetId,
            challengeId: request.ChallengeId,
            completedAfter: completedAfter,
            cancellationToken: cancellationToken);

        // Get quiz set titles for mapping
        var quizSetIds = allAttemptsData.Select(x => x.Challenge.QuizSetId).Distinct().ToList();
        var allQuizSets = await _quizSetRepository.GetAllAsync(cancellationToken);
        var quizSets = allQuizSets.Where(qs => quizSetIds.Contains(qs.Id)).ToList();
        var quizSetDict = quizSets.ToDictionary(qs => qs.Id, qs => qs.Title);

        // Get all attempt IDs
        var attemptIds = allAttemptsData.Select(x => x.Attempt.Id).ToList();

        // Load homework submissions with homework and class info using repository
        var submissionData = await _classRepository.GetHomeworkSubmissionsByAttemptIdsAsync(attemptIds, cancellationToken);
        
        var submissionDict = submissionData.ToDictionary(
            x => x.Submission.ChallengeAttemptId,
            x => (x.Submission, x.Homework, x.Class));

        // Load users for homework submissions to get real names
        var userIds = allAttemptsData
            .Where(x => x.Attempt.UserId.HasValue && submissionDict.ContainsKey(x.Attempt.Id))
            .Select(x => x.Attempt.UserId!.Value)
            .Distinct()
            .ToList();

        var users = await _userRepository.GetByIdsAsync(userIds, cancellationToken);
        var userDict = users.ToDictionary(u => u.Id, u => u.GetFullName());

        // Map to DTOs
        var entries = allAttemptsData
            .Select(x =>
            {
                var attempt = x.Attempt;
                var challenge = x.Challenge;
                var quizSetTitle = quizSetDict.GetValueOrDefault(challenge.QuizSetId);
                var isHomework = submissionDict.ContainsKey(attempt.Id);

                // For homework submissions, use user's real name if available
                var nickname = attempt.Nickname;
                if (isHomework && attempt.UserId.HasValue && userDict.TryGetValue(attempt.UserId.Value, out var fullName))
                {
                    nickname = fullName;
                }

                var entry = new GlobalLeaderboardEntryDto
                {
                    AttemptId = attempt.Id,
                    UserId = attempt.UserId,
                    Nickname = nickname,
                    Score = attempt.ScoreAchieved,
                    CorrectAnswers = attempt.CorrectAnswers,
                    TotalQuestions = attempt.TotalQuestions,
                    CompletionTimeMs = attempt.CompletionTimeMs,
                    CompletedAt = attempt.CompletedAt,
                    QuizSetId = challenge.QuizSetId,
                    QuizSetTitle = quizSetTitle,
                    ChallengeId = challenge.Id,
                    ChallengeTitle = challenge.Title,
                    Rank = 0, // Will be set after sorting
                    IsHomework = isHomework,
                };

                if (submissionDict.TryGetValue(attempt.Id, out var submissionInfo))
                {
                    var (homeworkSubmission, homework, classEntity) = submissionInfo;
                    entry.HomeworkId = homeworkSubmission.HomeworkId;
                    entry.HomeworkTitle = homework.Title;
                    entry.ClassId = homework.ClassId;
                    entry.ClassName = classEntity.Name;
                    entry.SubmissionStatus = homeworkSubmission.Status;
                }

                return entry;
            })
            .ToList();

        // Apply filters
        if (request.IsHomework.HasValue)
        {
            entries = entries.Where(e => e.IsHomework == request.IsHomework.Value).ToList();
        }

        if (request.ClassId.HasValue)
        {
            entries = entries.Where(e => e.ClassId == request.ClassId.Value).ToList();
        }

        if (request.HomeworkId.HasValue)
        {
            entries = entries.Where(e => e.HomeworkId == request.HomeworkId.Value).ToList();
        }

        // Apply sorting
        entries = SortEntries(entries, request.SortBy ?? "score", request.SortOrder ?? "desc");

        // Calculate ranks
        for (int i = 0; i < entries.Count; i++)
        {
            entries[i].Rank = i + 1;
        }

        // Pagination
        var totalEntries = entries.Count;
        var skip = (request.Page - 1) * request.PageSize;
        var pagedEntries = entries.Skip(skip).Take(request.PageSize).ToList();

        // Recalculate ranks for paginated entries
        for (int i = 0; i < pagedEntries.Count; i++)
        {
            pagedEntries[i].Rank = skip + i + 1;
        }

        return new LeaderboardDto
        {
            Entries = pagedEntries,
            TotalEntries = totalEntries,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalEntries / (double)request.PageSize)
        };
    }

    private static List<GlobalLeaderboardEntryDto> SortEntries(
        List<GlobalLeaderboardEntryDto> entries,
        string sortBy,
        string sortOrder)
    {
        var isAscending = sortOrder?.ToLower() == "asc";

        return sortBy?.ToLower() switch
        {
            "accuracy" => isAscending
                ? entries.OrderBy(e => e.TotalQuestions > 0 ? (double)e.CorrectAnswers / e.TotalQuestions : 0).ToList()
                : entries.OrderByDescending(e => e.TotalQuestions > 0 ? (double)e.CorrectAnswers / e.TotalQuestions : 0).ToList(),
            "time" => isAscending
                ? entries.OrderBy(e => e.CompletionTimeMs ?? int.MaxValue).ToList()
                : entries.OrderByDescending(e => e.CompletionTimeMs ?? int.MaxValue).ToList(),
            "completedAt" => isAscending
                ? entries.OrderBy(e => e.CompletedAt).ToList()
                : entries.OrderByDescending(e => e.CompletedAt).ToList(),
            _ => isAscending // Default: score
                ? entries.OrderBy(e => e.Score).ToList()
                : entries.OrderByDescending(e => e.Score).ToList()
        };
    }
}
