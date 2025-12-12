namespace ThinkTogether.Application.Interfaces;

public interface IGameSessionStateService
{
    Task AddPlayerConnectionAsync(string pin, Guid playerId, string connectionId);
    Task RemovePlayerConnectionAsync(string pin, Guid playerId);
    Task<PlayerConnectionInfo?> GetPlayerByConnectionIdAsync(string connectionId);
    Task<string?> GetPlayerNicknameAsync(string pin, Guid playerId);
    Task<int> GetPlayerCountAsync(string pin);
    
    Task SetHostConnectionAsync(string pin, string connectionId);
    Task<string?> GetHostConnectionAsync(string pin);
    
    Task SetGameSessionPinMappingAsync(Guid gameSessionId, string pin);
    Task<string?> GetPinByGameSessionIdAsync(Guid gameSessionId);
    Task SetTotalQuestionsAsync(Guid gameSessionId, int totalQuestions);
    Task<int> GetTotalQuestionsAsync(Guid gameSessionId);
    
    Task<int> IncrementAnswerCountAsync(string pin, Guid gameQuestionId);
    Task ResetAnswerCountAsync(string pin, Guid gameQuestionId);
    Task<int> GetAnswerCountAsync(string pin, Guid gameQuestionId);
    
    Task CleanupGameSessionAsync(string pin);
}

public record PlayerConnectionInfo(
    string Pin,
    Guid PlayerId,
    string Nickname,
    string ConnectionId);
