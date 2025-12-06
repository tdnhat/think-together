using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

/// <summary>
/// Represents the status of a challenge.
/// </summary>
public enum ChallengeStatus
{
    /// <summary>
    /// The challenge is active and available for participation.
    /// </summary>
    [Description("Đang hoạt động")]
    Active = 1,

    /// <summary>
    /// The challenge has been archived and is no longer active.
    /// </summary>
    [Description("Đã lưu trữ")]
    Archived = 2
}

