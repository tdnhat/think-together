using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum GameStatus
{
    [Description("Đang chờ người chơi")]
    Waiting = 1,

    [Description("Đang diễn ra")]
    InProgress = 2,

    [Description("Đã kết thúc")]
    Ended = 3
}

