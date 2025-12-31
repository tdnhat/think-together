using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum QuestionType
{
    [Description("Câu hỏi trắc nghiệm một đáp án")]
    SingleChoice = 1,

    [Description("Câu hỏi đúng/sai")]
    TrueFalse = 2,

    [Description("Câu hỏi trắc nghiệm nhiều đáp án")]
    MultipleChoice = 3,

    [Description("Câu hỏi ghép cặp")]
    Matching = 4,

    [Description("Câu hỏi sắp xếp thứ tự")]
    Ordering = 5,

    [Description("Câu hỏi video")]
    Video = 6,

    [Description("Câu hỏi audio")]
    Audio = 7
}

