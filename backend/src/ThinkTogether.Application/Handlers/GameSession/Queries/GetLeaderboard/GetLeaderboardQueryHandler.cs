using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.GameSession.Queries.GetLeaderboard;

public sealed class GetLeaderboardQueryHandler : IRequestHandler<GetLeaderboardQuery, List<LeaderboardEntryDto>>
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private readonly ILeaderboardService _leaderboardService;

    public GetLeaderboardQueryHandler(
        IGameSessionRepository gameSessionRepository,
        ILeaderboardService leaderboardService)
    {
        _gameSessionRepository = gameSessionRepository;
        _leaderboardService = leaderboardService;
    }

    public async Task<List<LeaderboardEntryDto>> Handle(GetLeaderboardQuery request, CancellationToken cancellationToken)
    {
        var spec = new GameSessionWithFullDetailsSpec(request.GameSessionId);
        var gameSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Phiên trò chơi", request.GameSessionId);

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
