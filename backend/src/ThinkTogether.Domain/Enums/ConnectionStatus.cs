using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum ConnectionStatus
{
    [Description("Đã kết nối")]
    Connected = 1,

    [Description("Đã ngắt kết nối")]
    Disconnected = 2,

    [Description("Đã rời khỏi")]
    Left = 3,

    [Description("Đã bị đuổi")]
    Kicked = 4
}


