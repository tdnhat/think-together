using Microsoft.Extensions.Logging;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Services;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;

namespace ThinkTogether.Infrastructure.Services;

public class HomeworkSubmissionService : IHomeworkSubmissionService
{
    private readonly IClassRepository _classRepository;
    private readonly ILogger<HomeworkSubmissionService> _logger;

    public HomeworkSubmissionService(
        IClassRepository classRepository,
        ILogger<HomeworkSubmissionService> logger)
    {
        _classRepository = classRepository;
        _logger = logger;
    }

    public async Task<bool> CreateSubmissionFromAttemptAsync(
        ChallengeAttempt attempt,
        Guid homeworkId,
        int score,
        CancellationToken cancellationToken = default)
    {
        if (!attempt.UserId.HasValue)
        {
            _logger.LogWarning("Cannot create homework submission for attempt {AttemptId} without UserId", attempt.Id);
            return false;
        }

        var result = await _classRepository.GetClassAndHomeworkByHomeworkIdAsync(homeworkId, cancellationToken);

        if (!result.HasValue)
        {
            _logger.LogWarning("Homework {HomeworkId} not found for attempt {AttemptId}", homeworkId, attempt.Id);
            return false;
        }

        var (homeworkClass, homework) = result.Value;

        var submission = HomeworkSubmission.Create(
            homeworkId: homework.Id,
            studentId: attempt.UserId.Value,
            challengeAttemptId: attempt.Id,
            score: score,
            dueDate: homework.DueDate);

        homework.AddSubmission(submission);
        await _classRepository.UpdateAsync(homeworkClass, cancellationToken);

        _logger.LogInformation(
            "Created homework submission for homework {HomeworkId}, attempt {AttemptId}, score {Score}",
            homework.Id, attempt.Id, score);

        return true;
    }
}

