using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

/// <summary>
/// Represents the status of a homework submission.
/// </summary>
public enum SubmissionStatus
{
    /// <summary>
    /// The homework has not been submitted yet.
    /// </summary>
    [Description("Chưa nộp")]
    NotSubmitted = 0,

    /// <summary>
    /// The homework was submitted on time.
    /// </summary>
    [Description("Đã nộp")]
    Submitted = 1,

    /// <summary>
    /// The homework was submitted after the due date.
    /// </summary>
    [Description("Nộp muộn")]
    Late = 2
}

