namespace ThinkTogether.Domain.Aggregates.UserAggregate.Services;

public interface ITokenBlacklistService
{
    Task BlacklistTokenAsync(string token, TimeSpan expirationTime, CancellationToken cancellationToken = default);
    Task<bool> IsTokenBlacklistedAsync(string token, CancellationToken cancellationToken = default);
}

