using MediatR;
using Microsoft.Extensions.Logging;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Events;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;

namespace ThinkTogether.Application.DomainEventHandlers.GameSession;

public class QuestionEndedDomainEventHandler : INotificationHandler<QuestionEndedDomainEvent>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ILeaderboardService _leaderboardService;
    private readonly IGameSessionNotificationService _notificationService;
    private readonly ILogger<QuestionEndedDomainEventHandler> _logger;

    public QuestionEndedDomainEventHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        ILeaderboardService leaderboardService,
        IGameSessionNotificationService notificationService,
        ILogger<QuestionEndedDomainEventHandler> logger)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _leaderboardService = leaderboardService;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task Handle(QuestionEndedDomainEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing QuestionEnded event for question {GameQuestionId} in session {GameSessionId}",
                notification.GameQuestionId, notification.GameSessionId);

            var spec = new GameSessionWithFullDetailsSpec(notification.GameSessionId);
            var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);
            if (gameSession == null)
            {
                _logger.LogWarning("Game session {GameSessionId} not found for QuestionEnded event", notification.GameSessionId);
                return;
            }

            var pin = gameSession.PIN;
            var gameQuestion = gameSession.GameQuestions.FirstOrDefault(q => q.Id == notification.GameQuestionId);
            if (gameQuestion == null)
            {
                _logger.LogWarning("Game question {GameQuestionId} not found", notification.GameQuestionId);
                return;
            }

            // Get correct answer indexes
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

            // Get correct option indexes (options are ordered by DisplayOrder, index is position in ordered list)
            var correctOptionIndexes = question.Options
                .OrderBy(o => o.DisplayOrder)
                .Select((opt, idx) => new { Option = opt, Index = idx })
                .Where(x => x.Option.IsCorrect)
                .Select(x => x.Index)
                .ToList();

            // Build leaderboard
            var leaderboard = _leaderboardService.BuildLeaderboard(gameSession);
            var leaderboardDto = leaderboard
                .Select(e => new LeaderboardEntryDto
                {
                    PlayerId = e.PlayerId,
                    Nickname = e.Nickname,
                    TotalPoints = e.TotalPoints,
                    CorrectAnswers = e.CorrectAnswers,
                    Rank = e.Rank,
                    AccuracyPercentage = e.AccuracyPercentage,
                    TotalTimeSpentMs = e.TotalTimeSpentMs
                })
                .ToList();

            // Get top players (top 5 or all if less than 5)
            var topPlayers = leaderboardDto
                .OrderBy(l => l.Rank)
                .Take(5)
                .ToList();

            await _notificationService.NotifyQuestionEndedAsync(
                pin,
                notification.GameQuestionId,
                correctOptionIndexes,
                gameQuestion.CorrectAnswerCount,
                gameQuestion.WrongAnswerCount,
                topPlayers);

            _logger.LogInformation("QuestionEnded event processed successfully for question {GameQuestionId}", notification.GameQuestionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing QuestionEnded event for question {GameQuestionId}", notification.GameQuestionId);
        }
    }
}

