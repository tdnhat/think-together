namespace ThinkTogether.Domain.Aggregates.GamingAggregate.Services;

public interface IPinGeneratorService
{
    Task<string> GenerateUniquePinAsync(CancellationToken cancellationToken = default);
}

