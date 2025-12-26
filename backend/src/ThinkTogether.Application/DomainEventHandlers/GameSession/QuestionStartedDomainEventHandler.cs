using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

namespace ThinkTogether.Application.DomainEventHandlers.GameSession;

public class QuestionStartedDomainEventHandler : INotificationHandler<QuestionStartedDomainEvent>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IGameQuestionMappingService _questionMappingService;
    private readonly IQuestionTimerService _questionTimerService;
    private readonly IGameSessionNotificationService _notificationService;
    private readonly ILogger<QuestionStartedDomainEventHandler> _logger;

    public QuestionStartedDomainEventHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        IGameQuestionMappingService questionMappingService,
        IQuestionTimerService questionTimerService,
        IGameSessionNotificationService notificationService,
        ILogger<QuestionStartedDomainEventHandler> logger)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _questionMappingService = questionMappingService;
        _questionTimerService = questionTimerService;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task Handle(QuestionStartedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing QuestionStarted event for question {GameQuestionId} in session {GameSessionId}",
                notification.GameQuestionId, notification.GameSessionId);

            var spec = new GameSessionWithFullDetailsSpec(notification.GameSessionId);
            var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);
            if (gameSession == null)
            {
                _logger.LogWarning("Game session {GameSessionId} not found for QuestionStarted event", notification.GameSessionId);
                return;
            }

            var pin = gameSession.PIN;
            var gameQuestion = gameSession.GameQuestions.FirstOrDefault(q => q.Id == notification.GameQuestionId);
            if (gameQuestion == null)
            {
                _logger.LogWarning("Game question {GameQuestionId} not found", notification.GameQuestionId);
                return;
            }

            var quizSet = await _quizSetRepository.GetByIdAsync(gameSession.QuizSetId, cancellationToken);
            if (quizSet == null)
            {
                _logger.LogWarning("Quiz set {QuizSetId} not found", gameSession.QuizSetId);
                return;
            }

            var question = quizSet.Questions.FirstOrDefault(q => q.Id == gameQuestion.QuestionId);
            if (question == null)
            {
                _logger.LogWarning("Question {QuestionId} not found", gameQuestion.QuestionId);
                return;
            }

            // Start timer if not already started (in case it wasn't started in GameStarted handler)
            var endTime = await _questionTimerService.GetQuestionEndTimeAsync(gameSession.Id, cancellationToken);
            if (endTime == null)
            {
                await _questionTimerService.StartTimerAsync(
                    gameSession.Id,
                    gameQuestion.Id,
                    question.TimeLimit,
                    cancellationToken);
                endTime = await _questionTimerService.GetQuestionEndTimeAsync(gameSession.Id, cancellationToken)
                    ?? DateTime.UtcNow.AddSeconds(question.TimeLimit);
            }

            var questionDto = _questionMappingService.MapToDto(gameQuestion, question);
            var totalQuestions = gameSession.GameQuestions.Count;

            await _notificationService.NotifyQuestionStartedAsync(
                pin,
                questionDto,
                totalQuestions,
                endTime.Value);

            _logger.LogInformation("QuestionStarted event processed successfully for question {GameQuestionId}", notification.GameQuestionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing QuestionStarted event for question {GameQuestionId}", notification.GameQuestionId);
        }
    }
}

