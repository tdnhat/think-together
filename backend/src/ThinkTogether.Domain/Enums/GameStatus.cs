using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

/// <summary>
/// Represents the status of a game session.
/// </summary>
public enum GameStatus
{
    /// <summary>
    /// The game is waiting for players to join.
    /// </summary>
    [Description("Đang chờ người chơi")]
    Waiting = 1,

    /// <summary>
    /// The game has started and is in progress.
    /// </summary>
    [Description("Đang diễn ra")]
    InProgress = 2,

    /// <summary>
    /// The game has ended.
    /// </summary>
    [Description("Đã kết thúc")]
    Ended = 3
}

