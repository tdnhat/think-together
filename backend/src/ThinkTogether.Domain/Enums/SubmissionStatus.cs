using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum SubmissionStatus
{
    [Description("Chưa nộp")]
    NotSubmitted = 0,

    [Description("Đã nộp")]
    Submitted = 1,

    [Description("Nộp muộn")]
    Late = 2
}

