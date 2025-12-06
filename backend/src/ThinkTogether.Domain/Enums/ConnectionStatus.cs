using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

/// <summary>
/// Represents the connection status of a player in a game session.
/// </summary>
public enum ConnectionStatus
{
    /// <summary>
    /// The player is currently connected to the game session.
    /// </summary>
    [Description("Đã kết nối")]
    Connected = 1,

    /// <summary>
    /// The player has disconnected from the game session.
    /// </summary>
    [Description("Đã ngắt kết nối")]
    Disconnected = 2
}

