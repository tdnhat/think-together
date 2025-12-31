using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Events;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.DomainEventHandlers.Challenge;

public sealed class UpdateQuestionStatisticsEventHandler : INotificationHandler<ChallengeAttemptCompletedDomainEvent>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IQuestionStatisticRepository _questionStatisticRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateQuestionStatisticsEventHandler> _logger;

    public UpdateQuestionStatisticsEventHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        IQuestionStatisticRepository questionStatisticRepository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateQuestionStatisticsEventHandler> logger)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _questionStatisticRepository = questionStatisticRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(ChallengeAttemptCompletedDomainEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating question statistics for attempt {AttemptId}", notification.AttemptId);

        var challenge = await _challengeRepository.GetByIdAsync(notification.ChallengeId, cancellationToken);
        if (challenge == null)
            return;

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == notification.AttemptId);
        if (attempt == null)
            return;

        // Get all statistics for the questions in this challenge
        var questionIds = attempt.Answers.Select(a => a.QuestionId).ToList();
        var existingStats = await _questionStatisticRepository.GetByQuestionIdsAsync(questionIds, cancellationToken);
        
        foreach (var answer in attempt.Answers)
        {
            var stat = existingStats.FirstOrDefault(s => s.QuestionId == answer.QuestionId);
            
            if (stat == null)
            {
                stat = QuestionStatistic.Create(answer.QuestionId);
                await _questionStatisticRepository.AddAsync(stat, cancellationToken);
            }

            stat.RecordAttempt(answer.IsCorrect, answer.SubmissionTimeMs);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
