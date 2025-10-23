using StackExchange.Redis;
using ThinkTogether.Domain.Aggregates.UserAggregate.Services;

namespace ThinkTogether.Infrastructure.Services;

public sealed class TokenBlacklistService : ITokenBlacklistService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _database;
    private const string BlacklistKeyPrefix = "blacklist:token:";

    public TokenBlacklistService(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _database = redis.GetDatabase();
    }

    public async Task BlacklistTokenAsync(string token, TimeSpan expirationTime,
        CancellationToken cancellationToken = default)
    {
        var key = GetBlacklistKey(token);
        await _database.StringSetAsync(key, "blacklisted", expirationTime);
    }

    public async Task<bool> IsTokenBlacklistedAsync(string token, CancellationToken cancellationToken = default)
    {
        var key = GetBlacklistKey(token);
        return await _database.KeyExistsAsync(key);
    }

    private static string GetBlacklistKey(string token)
    {
        return $"{BlacklistKeyPrefix}{token}";
    }
}