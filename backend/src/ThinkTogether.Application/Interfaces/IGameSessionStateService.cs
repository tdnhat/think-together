namespace ThinkTogether.Application.Interfaces;

public interface IGameSessionStateService
{
    // Player connection tracking
    Task AddPlayerConnectionAsync(string pin, Guid playerId, string connectionId, string nickname);
    Task RemovePlayerConnectionAsync(string pin, Guid playerId);
    Task<bool> RemovePlayerConnectionAsync(string pin, Guid playerId, string connectionId);
    Task<PlayerConnectionInfo?> GetPlayerByConnectionIdAsync(string connectionId);
    Task<string?> GetPlayerConnectionAsync(string pin, Guid playerId);
    Task<int> GetConnectedPlayerCountAsync(string pin); // Count of currently connected players
    
    // Host connection tracking
    Task SetHostConnectionAsync(string pin, string connectionId);
    Task<string?> GetHostConnectionAsync(string pin);
    
    // PIN mapping (needed to map game session ID to PIN for SignalR groups)
    Task SetGameSessionPinMappingAsync(Guid gameSessionId, string pin);
    Task<string?> GetPinByGameSessionIdAsync(Guid gameSessionId);
    
    // Cleanup
    Task CleanupGameSessionAsync(string pin);
}

public record PlayerConnectionInfo(
    string Pin,
    Guid PlayerId,
    string Nickname,
    string ConnectionId);
