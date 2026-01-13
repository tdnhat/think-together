using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Infrastructure.Services;

public sealed class RedisDistributedLockService : IDistributedLockService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisDistributedLockService> _logger;
    private const string KeyPrefix = "lock:";

    public RedisDistributedLockService(
        IConnectionMultiplexer redis,
        ILogger<RedisDistributedLockService> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    public async Task<IDistributedLock?> TryAcquireLockAsync(
        string resourceKey,
        TimeSpan expiry,
        CancellationToken ct = default)
    {
        var lockKey = $"{KeyPrefix}{resourceKey}";
        var lockValue = Guid.NewGuid().ToString();

        try
        {
            var db = _redis.GetDatabase();
            var acquired = await db.StringSetAsync(
                lockKey,
                lockValue,
                expiry,
                When.NotExists);

            if (acquired)
            {
                _logger.LogDebug("Acquired lock on {ResourceKey}", resourceKey);
                return new RedisDistributedLock(db, lockKey, lockValue, _logger);
            }

            _logger.LogDebug("Failed to acquire lock on {ResourceKey} - already held", resourceKey);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error acquiring lock on {ResourceKey}", resourceKey);
            return null;
        }
    }

    private sealed class RedisDistributedLock : IDistributedLock
    {
        private readonly IDatabase _db;
        private readonly string _lockKey;
        private readonly string _lockValue;
        private readonly ILogger _logger;
        private bool _disposed;

        public RedisDistributedLock(
            IDatabase db,
            string lockKey,
            string lockValue,
            ILogger logger)
        {
            _db = db;
            _lockKey = lockKey;
            _lockValue = lockValue;
            _logger = logger;
            IsAcquired = true;
        }

        public bool IsAcquired { get; private set; }

        public async Task<bool> ExtendAsync(TimeSpan extension)
        {
            if (_disposed || !IsAcquired)
                return false;

            try
            {
                // Only extend if we still own the lock
                var script = @"
                    if redis.call('get', KEYS[1]) == ARGV[1] then
                        return redis.call('pexpire', KEYS[1], ARGV[2])
                    else
                        return 0
                    end";

                var result = (int)await _db.ScriptEvaluateAsync(
                    script,
                    new RedisKey[] { _lockKey },
                    new RedisValue[] { _lockValue, (long)extension.TotalMilliseconds });

                return result == 1;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error extending lock on {LockKey}", _lockKey);
                return false;
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_disposed)
                return;

            _disposed = true;
            IsAcquired = false;

            try
            {
                // Only release if we still own the lock
                var script = @"
                    if redis.call('get', KEYS[1]) == ARGV[1] then
                        return redis.call('del', KEYS[1])
                    else
                        return 0
                    end";

                await _db.ScriptEvaluateAsync(
                    script,
                    new RedisKey[] { _lockKey },
                    new RedisValue[] { _lockValue });

                _logger.LogDebug("Released lock on {LockKey}", _lockKey);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error releasing lock on {LockKey}", _lockKey);
            }
        }
    }
}
