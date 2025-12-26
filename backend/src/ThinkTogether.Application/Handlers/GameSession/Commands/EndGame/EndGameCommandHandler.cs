using MediatR;
using ThinkTogether.Application.Common;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.EndGame;

public sealed class EndGameCommandHandler : BaseHandler, IRequestHandler<EndGameCommand, GameResultDto>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly IQuestionTimerService _questionTimerService;
    private readonly ILeaderboardService _leaderboardService;
    private readonly IUnitOfWork _unitOfWork;

    public EndGameCommandHandler(
        IGameSessionRepository gameSessionRepository,
        ICurrentUserService currentUserService,
        IQuestionTimerService questionTimerService,
        ILeaderboardService leaderboardService,
        IUnitOfWork unitOfWork)
        : base(currentUserService)
    {
        _gameSessionRepository = gameSessionRepository;
        _questionTimerService = questionTimerService;
        _leaderboardService = leaderboardService;
        _unitOfWork = unitOfWork;
    }

    public async Task<GameResultDto> Handle(EndGameCommand request, CancellationToken cancellationToken)
    {
        var hostUserId = GetCurrentHostUserId();

        var spec = new GameSessionWithFullDetailsSpec(request.GameSessionId);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Phiên trò chơi", request.GameSessionId);

        gameSession.ValidateHostPermission(hostUserId);

        await _questionTimerService.StopTimerAsync(request.GameSessionId, cancellationToken);

        gameSession.End();

        await _gameSessionRepository.UpdateAsync(gameSession, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var finalLeaderboard = _leaderboardService.BuildFinalLeaderboard(gameSession)
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

        return new GameResultDto
        {
            GameSessionId = gameSession.Id,
            TotalQuestions = gameSession.GameQuestions.Count,
            TotalPlayers = gameSession.Players.Count,
            StartedAt = gameSession.StartedAt ?? DateTime.UtcNow,
            EndedAt = gameSession.EndedAt ?? DateTime.UtcNow,
            Duration = (gameSession.EndedAt ?? DateTime.UtcNow) - (gameSession.StartedAt ?? DateTime.UtcNow),
            FinalLeaderboard = finalLeaderboard
        };
    }
}
