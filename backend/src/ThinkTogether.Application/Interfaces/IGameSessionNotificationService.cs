using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Interfaces;

public interface IGameSessionNotificationService
{
    Task NotifyGameStartedAsync(Guid gameSessionId, GameQuestionDto firstQuestion);
    Task NotifyNextQuestionAsync(Guid gameSessionId, List<LeaderboardEntryDto> leaderboard, GameQuestionDto? nextQuestion);
    Task NotifyGameEndedAsync(Guid gameSessionId, GameResultDto result);
    
    // New methods for event-driven architecture
    Task NotifyQuestionStartedAsync(string pin, GameQuestionDto question, int totalQuestions, DateTime endTime);
    Task NotifyAnswerReceivedAsync(string pin, Guid playerId, int answeredCount, int totalPlayers);
    Task NotifyQuestionEndedAsync(string pin, Guid gameQuestionId, List<int> correctOptionIndexes, int correctAnswerCount, int wrongAnswerCount, List<LeaderboardEntryDto> topPlayers);
    Task NotifyPlayerJoinedAsync(string pin, Guid playerId, string nickname, int totalPlayers);
}

