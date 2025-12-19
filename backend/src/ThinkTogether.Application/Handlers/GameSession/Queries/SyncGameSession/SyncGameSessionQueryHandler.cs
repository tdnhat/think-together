using MediatR;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.GameSession.Queries.SyncGameSession;

public sealed class SyncGameSessionQueryHandler : IRequestHandler<SyncGameSessionQuery, SyncGameSessionResult>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IQuestionTimerService _questionTimerService;
    private readonly ILeaderboardService _leaderboardService;
    private readonly ICurrentUserService _currentUserService;

    public SyncGameSessionQueryHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        IQuestionTimerService questionTimerService,
        ILeaderboardService leaderboardService,
        ICurrentUserService currentUserService)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _questionTimerService = questionTimerService;
        _leaderboardService = leaderboardService;
        _currentUserService = currentUserService;
    }

    public async Task<SyncGameSessionResult> Handle(SyncGameSessionQuery request, CancellationToken cancellationToken)
    {
        var spec = new GameSessionWithFullDetailsSpec(request.GameSessionId);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Phiên trò chơi", request.GameSessionId);

        // Determine if requester is host
        var isHost = IsCurrentUserHost(gameSession.HostUserId);

        // Map status
        var status = MapStatus(gameSession.Status);

        // Build players list with scores
        var players = BuildPlayersList(gameSession);

        // Build current question if in progress
        SyncCurrentQuestionDto? currentQuestion = null;
        if (gameSession.Status == GameStatus.InProgress)
        {
            currentQuestion = await BuildCurrentQuestionAsync(gameSession, cancellationToken);
        }

        return new SyncGameSessionResult(
            Status: status,
            CurrentQuestion: currentQuestion,
            Players: players,
            IsHost: isHost,
            CurrentQuestionIndex: gameSession.CurrentQuestionIndex,
            TotalQuestions: gameSession.GameQuestions.Count);
    }

    private bool IsCurrentUserHost(Guid hostUserId)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString))
            return false;

        if (!Guid.TryParse(userIdString, out var userId))
            return false;

        return userId == hostUserId;
    }

    private static string MapStatus(GameStatus status)
    {
        return status switch
        {
            GameStatus.Waiting => "LOBBY",
            GameStatus.InProgress => "IN_PROGRESS",
            GameStatus.Ended => "FINISHED",
            _ => "UNKNOWN"
        };
    }

    private List<SyncPlayerDto> BuildPlayersList(Domain.Aggregates.GamingAggregate.GameSession gameSession)
    {
        var leaderboard = _leaderboardService.BuildLeaderboard(gameSession);

        return gameSession.Players.Select(p =>
        {
            var entry = leaderboard.FirstOrDefault(e => e.PlayerId == p.Id);
            return new SyncPlayerDto(
                Id: p.Id,
                Nickname: p.Nickname,
                Score: entry?.TotalPoints ?? 0);
        }).ToList();
    }

    private async Task<SyncCurrentQuestionDto?> BuildCurrentQuestionAsync(
        Domain.Aggregates.GamingAggregate.GameSession gameSession,
        CancellationToken cancellationToken)
    {
        var gameQuestion = gameSession.GetCurrentGameQuestion();
        if (gameQuestion == null)
            return null;

        var quizSet = await _quizSetRepository.GetByIdAsync(gameSession.QuizSetId, cancellationToken);
        var question = quizSet?.Questions.FirstOrDefault(q => q.Id == gameQuestion.QuestionId);
        if (question == null)
            return null;

        // Get the end time from timer service
        var endTime = await _questionTimerService.GetQuestionEndTimeAsync(gameSession.Id, cancellationToken);
        if (endTime == null)
        {
            // Fallback: calculate end time based on start time + time limit
            var startTime = await _questionTimerService.GetQuestionStartTimeAsync(gameSession.Id, cancellationToken);
            endTime = startTime?.AddSeconds(question.TimeLimit) ?? DateTime.UtcNow.AddSeconds(question.TimeLimit);
        }

        return new SyncCurrentQuestionDto(
            Id: question.Id,
            GameQuestionId: gameQuestion.Id,
            Content: question.Content,
            QuestionType: question.Type.ToString(),
            EndTime: endTime.Value,
            TotalTimeSeconds: question.TimeLimit,
            PositionInGame: gameQuestion.PositionInGame,
            VideoUrl: question.VideoUrl,
            VideoTimestamp: question.VideoTimestamp,
            Options: question.Options
                .OrderBy(o => o.DisplayOrder)
                .Select((o, index) => new SyncQuestionOptionDto(
                    Index: index,
                    Content: o.Content,
                    ImageUrl: o.ImageUrl))
                .ToList());
    }
}
