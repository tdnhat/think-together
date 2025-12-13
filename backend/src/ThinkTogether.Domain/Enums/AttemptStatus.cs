using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

/// <summary>
/// Represents the status of a challenge attempt.
/// </summary>
public enum AttemptStatus
{
    /// <summary>
    /// The attempt is in progress.
    /// </summary>
    [Description("Đang làm")]
    InProgress = 1,

    /// <summary>
    /// The attempt has been completed.
    /// </summary>
    [Description("Đã hoàn thành")]
    Completed = 2,

    /// <summary>
    /// The attempt was abandoned or expired.
    /// </summary>
    [Description("Đã bỏ dở")]
    Abandoned = 3
}
