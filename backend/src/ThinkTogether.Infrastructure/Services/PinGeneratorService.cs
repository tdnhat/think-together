using System.Security.Cryptography;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Services;
using ThinkTogether.Domain.Aggregates.GamingAggregate.Specifications;

namespace ThinkTogether.Infrastructure.Services;

public class PinGeneratorService : IPinGeneratorService
{
    private readonly IGameSessionRepository _gameSessionRepository;
    private const int MaxAttempts = 10;

    public PinGeneratorService(IGameSessionRepository gameSessionRepository)
    {
        _gameSessionRepository = gameSessionRepository;
    }

    public async Task<string> GenerateUniquePinAsync(CancellationToken cancellationToken = default)
    {
        for (int attempt = 0; attempt < MaxAttempts; attempt++)
        {
            var pin = GeneratePin();

            var spec = new ActivePinSpec(pin);
            var existingSession = await _gameSessionRepository.GetBySpecAsync(spec, cancellationToken);
            if (existingSession == null)
            {
                return pin;
            }
        }

        throw new InvalidOperationException("Không thể tạo mã PIN duy nhất sau nhiều lần thử");
    }

    private static string GeneratePin()
    {
        // Generate a 6-digit PIN using cryptographically secure random numbers
        using var rng = RandomNumberGenerator.Create();
        var bytes = new byte[4];
        rng.GetBytes(bytes);
        
        var number = BitConverter.ToUInt32(bytes, 0) % 1000000;
        return number.ToString("D6");
    }
}

