using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum ChallengeStatus
{
    [Description("Đang hoạt động")]
    Active = 1,

    [Description("Đã lưu trữ")]
    Archived = 2
}

