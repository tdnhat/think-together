using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Interfaces;

public interface IGameSessionNotificationService
{
    Task NotifyGameStartedAsync(Guid gameSessionId, GameQuestionDto firstQuestion);
    Task NotifyNextQuestionAsync(Guid gameSessionId, List<LeaderboardEntryDto> leaderboard, GameQuestionDto? nextQuestion);
    Task NotifyGameEndedAsync(Guid gameSessionId, GameResultDto result);
}

