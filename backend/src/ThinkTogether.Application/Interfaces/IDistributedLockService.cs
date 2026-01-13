namespace ThinkTogether.Application.Interfaces;

/// <summary>
/// Service for distributed locking across multiple server instances.
/// </summary>
public interface IDistributedLockService
{
    /// <summary>
    /// Attempts to acquire a distributed lock on the specified resource.
    /// </summary>
    /// <param name="resourceKey">Unique key identifying the resource to lock</param>
    /// <param name="expiry">Lock expiration time</param>
    /// <param name="ct">Cancellation token</param>
    /// <returns>Lock handle if acquired, null otherwise</returns>
    Task<IDistributedLock?> TryAcquireLockAsync(
        string resourceKey,
        TimeSpan expiry,
        CancellationToken ct = default);
}

/// <summary>
/// Handle to a distributed lock. Dispose to release.
/// </summary>
public interface IDistributedLock : IAsyncDisposable
{
    bool IsAcquired { get; }
    
    /// <summary>
    /// Extends the lock expiration time.
    /// </summary>
    Task<bool> ExtendAsync(TimeSpan extension);
}
