using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum ConnectionStatus
{
    [Description("Đã kết nối")]
    Connected = 1,

    [Description("Đã ngắt kết nối")]
    Disconnected = 2
}

