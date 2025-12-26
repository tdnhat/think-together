using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

namespace ThinkTogether.Application.DomainEventHandlers.GameSession;

public class GameStartedDomainEventHandler : INotificationHandler<GameStartedDomainEvent>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IGameQuestionMappingService _questionMappingService;
    private readonly IQuestionTimerService _questionTimerService;
    private readonly IGameSessionNotificationService _notificationService;
    private readonly IGameSessionStateService _stateService;
    private readonly ILogger<GameStartedDomainEventHandler> _logger;

    public GameStartedDomainEventHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        IGameQuestionMappingService questionMappingService,
        IQuestionTimerService questionTimerService,
        IGameSessionNotificationService notificationService,
        IGameSessionStateService stateService,
        ILogger<GameStartedDomainEventHandler> logger)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _questionMappingService = questionMappingService;
        _questionTimerService = questionTimerService;
        _notificationService = notificationService;
        _stateService = stateService;
        _logger = logger;
    }

    public async Task Handle(GameStartedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing GameStarted event for session {GameSessionId}", notification.GameSessionId);

            var spec = new GameSessionWithFullDetailsSpec(notification.GameSessionId);
            var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);
            if (gameSession == null)
            {
                _logger.LogWarning("Game session {GameSessionId} not found for GameStarted event", notification.GameSessionId);
                return;
            }

            var firstGameQuestion = gameSession.GetCurrentGameQuestion();
            if (firstGameQuestion == null)
            {
                _logger.LogWarning("No current question found for game session {GameSessionId}", notification.GameSessionId);
                return;
            }

            var quizSet = await _quizSetRepository.GetByIdAsync(gameSession.QuizSetId, cancellationToken);
            if (quizSet == null)
            {
                _logger.LogWarning("Quiz set {QuizSetId} not found for game session {GameSessionId}", gameSession.QuizSetId, notification.GameSessionId);
                return;
            }

            var question = quizSet.Questions.FirstOrDefault(q => q.Id == firstGameQuestion.QuestionId);
            if (question == null)
            {
                _logger.LogWarning("Question {QuestionId} not found for game session {GameSessionId}", firstGameQuestion.QuestionId, notification.GameSessionId);
                return;
            }

            // Start timer for the first question
            await _questionTimerService.StartTimerAsync(
                gameSession.Id,
                firstGameQuestion.Id,
                question.TimeLimit,
                cancellationToken);

            var questionDto = _questionMappingService.MapToDto(firstGameQuestion, question);

            // Send GameStarted notification
            await _notificationService.NotifyGameStartedAsync(gameSession.Id, questionDto, notification.TotalQuestions);

            // Note: QuestionStarted notification will be sent by QuestionStartedDomainEventHandler
            // when StartQuestion() fires QuestionStartedDomainEvent, so we don't send it here to avoid duplicates

            _logger.LogInformation("GameStarted event processed successfully for session {GameSessionId}", notification.GameSessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing GameStarted event for session {GameSessionId}", notification.GameSessionId);
        }
    }
}

