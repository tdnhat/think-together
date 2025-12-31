using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum AttemptStatus
{
    [Description("Đang làm")]
    InProgress = 1,

    [Description("Đã hoàn thành")]
    Completed = 2,

    [Description("Đã bỏ dở")]
    Abandoned = 3
}
