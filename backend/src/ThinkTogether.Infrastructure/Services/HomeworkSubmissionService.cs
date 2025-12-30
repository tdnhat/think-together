using Microsoft.Extensions.Logging;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Services;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
using ThinkTogether.Domain.Exceptions;

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

        // Check if student already has a submission for this homework
        var existingSubmission = homework.Submissions.FirstOrDefault(s => s.StudentId == attempt.UserId.Value);
        if (existingSubmission != null)
        {
            _logger.LogWarning(
                "Student {StudentId} already has a submission {SubmissionId} for homework {HomeworkId}",
                attempt.UserId.Value, existingSubmission.Id, homework.Id);
            throw new ConflictException("Học sinh đã nộp bài tập này rồi. Mỗi học sinh chỉ được nộp một lần.");
        }

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

