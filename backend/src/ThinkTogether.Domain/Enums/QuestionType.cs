using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

/// <summary>
/// Represents the types of questions available in a quiz.
/// </summary>
public enum QuestionType
{
    /// <summary>
    /// A question with multiple options where only one answer is correct.
    /// </summary>
    [Description("Câu hỏi trắc nghiệm một đáp án")]
    SingleChoice = 1,

    /// <summary>
    /// A question with only true or false as possible answers.
    /// </summary>
    [Description("Câu hỏi đúng/sai")]
    TrueFalse = 2,

    /// <summary>
    /// A question with multiple options where more than one answer can be correct.
    /// </summary>
    [Description("Câu hỏi trắc nghiệm nhiều đáp án")]
    MultipleChoice = 3,

    /// <summary>
    /// A question where users must match items from two columns.
    /// </summary>
    [Description("Câu hỏi ghép cặp")]
    Matching = 4,

    /// <summary>
    /// A question where users must arrange items in the correct order.
    /// </summary>
    [Description("Câu hỏi sắp xếp thứ tự")]
    Ordering = 5,

    /// <summary>
    /// A question that includes video content.
    /// </summary>
    [Description("Câu hỏi video")]
    Video = 6
}

