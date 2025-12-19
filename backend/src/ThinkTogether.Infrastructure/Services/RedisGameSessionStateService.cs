using System.Text.Json;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Infrastructure.Services;

public class RedisGameSessionStateService : IGameSessionStateService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisGameSessionStateService> _logger;
    private const string KeyPrefix = "game:";
    private const int ExpirationHours = 24;

    public RedisGameSessionStateService(
        IConnectionMultiplexer redis,
        ILogger<RedisGameSessionStateService> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    private IDatabase GetDatabase() => _redis.GetDatabase();

    public async Task AddPlayerConnectionAsync(string pin, Guid playerId, string connectionId)
    {
        var db = GetDatabase();
        var expiry = TimeSpan.FromHours(ExpirationHours);

        var playerKey = GetPlayerKey(pin);
        
        // Check for existing connection and clean it up if different
        var existingPlayerJson = await db.HashGetAsync(playerKey, playerId.ToString());
        if (existingPlayerJson.HasValue)
        {
            var existingPlayerData = JsonSerializer.Deserialize<PlayerData>(existingPlayerJson.ToString());
            if (existingPlayerData != null && existingPlayerData.ConnectionId != connectionId)
            {
                // Remove the old connection key
                var oldConnectionKey = GetConnectionKey(existingPlayerData.ConnectionId);
                await db.KeyDeleteAsync(oldConnectionKey);
                _logger.LogDebug("Cleaned up old connection {OldConnectionId} for player {PlayerId}", 
                    existingPlayerData.ConnectionId, playerId);
            }
        }

        var playerData = new PlayerData(playerId, connectionId, DateTime.UtcNow);
        await db.HashSetAsync(playerKey, playerId.ToString(), JsonSerializer.Serialize(playerData));
        await db.KeyExpireAsync(playerKey, expiry);

        var connectionKey = GetConnectionKey(connectionId);
        var connectionData = new ConnectionData(pin, playerId, "");
        await db.StringSetAsync(connectionKey, JsonSerializer.Serialize(connectionData), expiry);

        _logger.LogDebug("Added player {PlayerId} to game {Pin} with connection {ConnectionId}", 
            playerId, pin, connectionId);
    }

    public async Task RemovePlayerConnectionAsync(string pin, Guid playerId)
    {
        var db = GetDatabase();
        var playerKey = GetPlayerKey(pin);
        var playerJson = await db.HashGetAsync(playerKey, playerId.ToString());
        
        if (playerJson.HasValue)
        {
            var playerData = JsonSerializer.Deserialize<PlayerData>(playerJson.ToString());
            if (playerData != null)
            {
                var connectionKey = GetConnectionKey(playerData.ConnectionId);
                await db.KeyDeleteAsync(connectionKey);
            }
        }

        await db.HashDeleteAsync(playerKey, playerId.ToString());
        _logger.LogDebug("Removed player {PlayerId} from game {Pin}", playerId, pin);
    }

    public async Task<bool> RemovePlayerConnectionAsync(string pin, Guid playerId, string connectionId)
    {
        var db = GetDatabase();
        var playerKey = GetPlayerKey(pin);
        var playerJson = await db.HashGetAsync(playerKey, playerId.ToString());
        
        if (playerJson.HasValue)
        {
            var playerData = JsonSerializer.Deserialize<PlayerData>(playerJson.ToString());
            if (playerData != null)
            {
                // Only remove if the connection ID matches
                if (playerData.ConnectionId == connectionId)
                {
                    var connectionKey = GetConnectionKey(connectionId);
                    await db.KeyDeleteAsync(connectionKey);
                    await db.HashDeleteAsync(playerKey, playerId.ToString());
                    _logger.LogDebug("Removed player {PlayerId} from game {Pin} (Connection match)", playerId, pin);
                    return true;
                }
                else
                {
                    _logger.LogDebug("Skipped removing player {PlayerId} from game {Pin} - Connection mismatch (Stored: {Stored}, Request: {Request})", 
                        playerId, pin, playerData.ConnectionId, connectionId);
                        
                    // Cleanup the requesting connection key if it exists
                    var requestConnectionKey = GetConnectionKey(connectionId);
                    await db.KeyDeleteAsync(requestConnectionKey);
                    return false;
                }
            }
        }
        else
        {
             // Player not in session, just clean up connection key
             var connectionKey = GetConnectionKey(connectionId);
             await db.KeyDeleteAsync(connectionKey);
        }
        
        return false;
    }

    public async Task<PlayerConnectionInfo?> GetPlayerByConnectionIdAsync(string connectionId)
    {
        var db = GetDatabase();
        var connectionKey = GetConnectionKey(connectionId);
        var connectionJson = await db.StringGetAsync(connectionKey);

        if (!connectionJson.HasValue)
            return null;

        var connectionData = JsonSerializer.Deserialize<ConnectionData>(connectionJson.ToString());
        if (connectionData == null)
            return null;

        return new PlayerConnectionInfo(
            connectionData.Pin,
            connectionData.PlayerId,
            connectionData.Nickname,
            connectionId);
    }

    public async Task<string?> GetPlayerConnectionAsync(string pin, Guid playerId)
    {
        var db = GetDatabase();
        var playerKey = GetPlayerKey(pin);
        var playerJson = await db.HashGetAsync(playerKey, playerId.ToString());

        if (!playerJson.HasValue)
            return null;

        var playerData = JsonSerializer.Deserialize<PlayerData>(playerJson.ToString());
        return playerData?.ConnectionId;
    }

    public Task<string?> GetPlayerNicknameAsync(string pin, Guid playerId)
    {
        return Task.FromResult<string?>(null);
    }

    public async Task<int> GetPlayerCountAsync(string pin)
    {
        var db = GetDatabase();
        var playerKey = GetPlayerKey(pin);
        return (int)await db.HashLengthAsync(playerKey);
    }

    public async Task SetHostConnectionAsync(string pin, string connectionId)
    {
        var db = GetDatabase();
        var hostKey = GetHostKey(pin);
        await db.StringSetAsync(hostKey, connectionId, TimeSpan.FromHours(ExpirationHours));

        _logger.LogDebug("Set host connection for game {Pin}: {ConnectionId}", pin, connectionId);
    }

    public async Task<string?> GetHostConnectionAsync(string pin)
    {
        var db = GetDatabase();
        var hostKey = GetHostKey(pin);
        return await db.StringGetAsync(hostKey);
    }

    public async Task SetGameSessionPinMappingAsync(Guid gameSessionId, string pin)
    {
        var db = GetDatabase();
        var mappingKey = GetSessionMappingKey(gameSessionId);
        await db.StringSetAsync(mappingKey, pin, TimeSpan.FromHours(ExpirationHours));

        _logger.LogDebug("Mapped game session {GameSessionId} to PIN {Pin}", gameSessionId, pin);
    }

    public async Task<string?> GetPinByGameSessionIdAsync(Guid gameSessionId)
    {
        var db = GetDatabase();
        var mappingKey = GetSessionMappingKey(gameSessionId);
        return await db.StringGetAsync(mappingKey);
    }

    public async Task SetTotalQuestionsAsync(Guid gameSessionId, int totalQuestions)
    {
        var db = GetDatabase();
        var totalQuestionsKey = GetTotalQuestionsKey(gameSessionId);
        await db.StringSetAsync(totalQuestionsKey, totalQuestions.ToString(), TimeSpan.FromHours(ExpirationHours));

        _logger.LogDebug("Set total questions for game session {GameSessionId}: {TotalQuestions}", gameSessionId, totalQuestions);
    }

    public async Task<int> GetTotalQuestionsAsync(Guid gameSessionId)
    {
        var db = GetDatabase();
        var totalQuestionsKey = GetTotalQuestionsKey(gameSessionId);
        var value = await db.StringGetAsync(totalQuestionsKey);
        return value.HasValue && int.TryParse(value.ToString(), out var count) ? count : 0;
    }

    public async Task<int> IncrementAnswerCountAsync(string pin, Guid gameQuestionId)
    {
        var db = GetDatabase();
        var answerKey = GetAnswerCountKey(pin, gameQuestionId);
        var count = await db.StringIncrementAsync(answerKey);
        await db.KeyExpireAsync(answerKey, TimeSpan.FromHours(ExpirationHours));
        return (int)count;
    }

    public async Task ResetAnswerCountAsync(string pin, Guid gameQuestionId)
    {
        var db = GetDatabase();
        var answerKey = GetAnswerCountKey(pin, gameQuestionId);
        await db.KeyDeleteAsync(answerKey);
    }

    public async Task<int> GetAnswerCountAsync(string pin, Guid gameQuestionId)
    {
        var db = GetDatabase();
        var answerKey = GetAnswerCountKey(pin, gameQuestionId);
        var value = await db.StringGetAsync(answerKey);
        return value.HasValue ? (int)value : 0;
    }

    public async Task CleanupGameSessionAsync(string pin)
    {
        var db = GetDatabase();
        var server = _redis.GetServer(_redis.GetEndPoints()[0]);

        var pattern = $"{KeyPrefix}{pin}:*";
        var keys = server.Keys(pattern: pattern).ToArray();
        
        if (keys.Length > 0)
        {
            await db.KeyDeleteAsync(keys);
        }

        _logger.LogDebug("Cleaned up game session {Pin}, deleted {Count} keys", pin, keys.Length);
    }

    private static string GetPlayerKey(string pin) => $"{KeyPrefix}{pin}:players";
    private static string GetHostKey(string pin) => $"{KeyPrefix}{pin}:host";
    private static string GetConnectionKey(string connectionId) => $"{KeyPrefix}conn:{connectionId}";
    private static string GetSessionMappingKey(Guid sessionId) => $"{KeyPrefix}session:{sessionId}";
    private static string GetTotalQuestionsKey(Guid sessionId) => $"{KeyPrefix}session:{sessionId}:totalQuestions";
    private static string GetAnswerCountKey(string pin, Guid questionId) => $"{KeyPrefix}{pin}:answers:{questionId}";

    private sealed record PlayerData(Guid PlayerId, string ConnectionId, DateTime JoinedAt);
    private sealed record ConnectionData(string Pin, Guid PlayerId, string Nickname);
}
