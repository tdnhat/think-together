using Shared.Primitives;

namespace Domain.Aggregates.GamingAggregate.Entities;

public enum ConnectionStatus
{
    Connected,
    Disconnected
}

public sealed class GamePlayer : Entity
{
    private GamePlayer()
    {
    }

    public Guid Id { get; private set; }

    public Guid GameSessionId { get; private set; }

    public string Nickname { get; private set; } = string.Empty;

    public ConnectionStatus ConnectionStatus { get; private set; }

    public static GamePlayer Create(Guid gameSessionId, string nickname)
    {
        if (gameSessionId == Guid.Empty)
            throw new ArgumentException("Game session ID cannot be empty", nameof(gameSessionId));

        if (string.IsNullOrWhiteSpace(nickname))
            throw new ArgumentException("Nickname cannot be empty", nameof(nickname));

        if (nickname.Length < 2 || nickname.Length > 100)
            throw new ArgumentException("Nickname must be between 2 and 100 characters", nameof(nickname));

        return new GamePlayer
        {
            Id = Guid.NewGuid(),
            GameSessionId = gameSessionId,
            Nickname = nickname.Trim(),
            ConnectionStatus = ConnectionStatus.Connected,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void SetConnectionStatus(ConnectionStatus status)
    {
        ConnectionStatus = status;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Connect()
    {
        ConnectionStatus = ConnectionStatus.Connected;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Disconnect()
    {
        ConnectionStatus = ConnectionStatus.Disconnected;
        UpdatedAt = DateTime.UtcNow;
    }
}

