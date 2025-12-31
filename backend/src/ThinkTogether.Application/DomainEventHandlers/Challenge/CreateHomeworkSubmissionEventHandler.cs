using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Events;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Services;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.DomainEventHandlers.Challenge;

public sealed class CreateHomeworkSubmissionEventHandler : INotificationHandler<ChallengeAttemptCompletedDomainEvent>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IHomeworkSubmissionService _homeworkSubmissionService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateHomeworkSubmissionEventHandler> _logger;

    public CreateHomeworkSubmissionEventHandler(
        IChallengeRepository challengeRepository,
        IHomeworkSubmissionService homeworkSubmissionService,
        IUnitOfWork unitOfWork,
        ILogger<CreateHomeworkSubmissionEventHandler> logger)
    {
        _challengeRepository = challengeRepository;
        _homeworkSubmissionService = homeworkSubmissionService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(ChallengeAttemptCompletedDomainEvent notification, CancellationToken cancellationToken)
    {
        if (notification.HomeworkId == null)
            return;

        _logger.LogInformation(
            "Creating homework submission for attempt {AttemptId} and homework {HomeworkId}", 
            notification.AttemptId, notification.HomeworkId);

        var challenge = await _challengeRepository.GetByIdAsync(notification.ChallengeId, cancellationToken);
        if (challenge == null)
        {
            _logger.LogWarning("Challenge {ChallengeId} not found for attempt {AttemptId}", notification.ChallengeId, notification.AttemptId);
            return;
        }

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == notification.AttemptId);
        if (attempt == null)
        {
            _logger.LogWarning("Attempt {AttemptId} not found", notification.AttemptId);
            return;
        }

        try
        {
             await _homeworkSubmissionService.CreateSubmissionFromAttemptAsync(
                attempt,
                notification.HomeworkId.Value,
                notification.Score,
                cancellationToken);
            
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create homework submission for attempt {AttemptId}", notification.AttemptId);
            // Optionally: don't rethrow to avoid failing the main transaction if using eventual consistency?
            // But interceptor runs before SaveChanges? No, interceptor runs DURING SaveChanges but before commit.
            // If this fails, the whole SaveChanges fails. Which is GOOD if we want consistency.
            // So rethrowing is fine (default behavior).
            throw; 
        }
    }
}
