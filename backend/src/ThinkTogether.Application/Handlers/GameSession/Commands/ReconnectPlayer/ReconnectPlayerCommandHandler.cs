using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.ReconnectPlayer;

public sealed class ReconnectPlayerCommandHandler : IRequestHandler<ReconnectPlayerCommand, ReconnectPlayerResult>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly ILeaderboardService _leaderboardService;
    private readonly IGameQuestionMappingService _questionMappingService;
    private readonly IUnitOfWork _unitOfWork;

    public ReconnectPlayerCommandHandler(
        IGameSessionRepository gameSessionRepository,
        IQuizSetRepository quizSetRepository,
        ILeaderboardService leaderboardService,
        IGameQuestionMappingService questionMappingService,
        IUnitOfWork unitOfWork)
    {
        _gameSessionRepository = gameSessionRepository;
        _quizSetRepository = quizSetRepository;
        _leaderboardService = leaderboardService;
        _questionMappingService = questionMappingService;
        _unitOfWork = unitOfWork;
    }

    public async Task<ReconnectPlayerResult> Handle(ReconnectPlayerCommand request, CancellationToken cancellationToken)
    {
        var spec = new GameSessionByPinSpec(request.Pin);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);

        if (gameSession == null)
            return ReconnectPlayerResult.Failed();

        var player = gameSession.GetPlayer(request.PlayerId);
        if (player == null)
            return ReconnectPlayerResult.Failed();

        player.Connect(request.ConnectionId);

        await _gameSessionRepository.UpdateAsync(gameSession, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var gameSessionDto = BuildGameSessionDto(gameSession);
        var playerDto = BuildPlayerDto(gameSession, player);
        var currentQuestionDto = await BuildCurrentQuestionDto(gameSession, cancellationToken);
        var leaderboard = BuildLeaderboardDto(gameSession);

        return new ReconnectPlayerResult(
            Success: true,
            GameSession: gameSessionDto,
            Player: playerDto,
            CurrentQuestion: currentQuestionDto,
            Leaderboard: leaderboard);
    }

    private static GameSessionDto BuildGameSessionDto(Domain.Aggregates.GamingAggregate.GameSession gameSession)
    {
        return new GameSessionDto
        {
            Id = gameSession.Id,
            HostUserId = gameSession.HostUserId,
            QuizSetId = gameSession.QuizSetId,
            PIN = gameSession.PIN,
            Status = gameSession.Status,
            CurrentQuestionIndex = gameSession.CurrentQuestionIndex,
            TotalQuestions = gameSession.GameQuestions.Count,
            StartedAt = gameSession.StartedAt,
            EndedAt = gameSession.EndedAt,
            Players = gameSession.Players.Select(p => new GamePlayerDto
            {
                Id = p.Id,
                Nickname = p.Nickname,
                ConnectionStatus = p.ConnectionStatus,
                TotalPoints = 0,
                Rank = null
            }).ToList()
        };
    }

    private static GamePlayerDto BuildPlayerDto(
        Domain.Aggregates.GamingAggregate.GameSession gameSession,
        Domain.Aggregates.GamingAggregate.Entities.GamePlayer player)
    {
        var playerScore = gameSession.Scores.FirstOrDefault(s => s.GamePlayerId == player.Id);
        return new GamePlayerDto
        {
            Id = player.Id,
            Nickname = player.Nickname,
            ConnectionStatus = player.ConnectionStatus,
            TotalPoints = playerScore?.TotalPoints ?? 0,
            Rank = playerScore?.FinalRank
        };
    }

    private async Task<GameQuestionDto?> BuildCurrentQuestionDto(
        Domain.Aggregates.GamingAggregate.GameSession gameSession,
        CancellationToken cancellationToken)
    {
        if (gameSession.Status != GameStatus.InProgress)
            return null;

        var gameQuestion = gameSession.GetCurrentGameQuestion();
        if (gameQuestion == null)
            return null;

        var quizSet = await _quizSetRepository.GetByIdAsync(gameSession.QuizSetId, cancellationToken);
        var question = quizSet?.Questions.FirstOrDefault(q => q.Id == gameQuestion.QuestionId);

        if (question == null)
            return null;

        return _questionMappingService.MapToDto(gameQuestion, question);
    }

    private List<LeaderboardEntryDto> BuildLeaderboardDto(Domain.Aggregates.GamingAggregate.GameSession gameSession)
    {
        return _leaderboardService.BuildLeaderboard(gameSession)
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
    }
}
