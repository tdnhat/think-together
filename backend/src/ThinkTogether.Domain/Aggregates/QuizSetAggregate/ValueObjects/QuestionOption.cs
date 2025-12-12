using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;

public record QuestionOption
{
    public string Content { get; init; } = string.Empty;

    public bool IsCorrect { get; init; }

    public string? ImageUrl { get; init; }

    public int DisplayOrder { get; init; }

    private QuestionOption()
    {
    }

    public static QuestionOption Create(
        string content,
        bool isCorrect,
        string? imageUrl = null,
        int displayOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ValidationException("Nội dung không được trống");

        if (content.Length > 1000)
            throw new ValidationException("Nội dung không được vượt quá 1000 ký tự");

        if (imageUrl != null && imageUrl.Length > 500)
            throw new ValidationException("URL hình ảnh không được vượt quá 500 ký tự");

        if (displayOrder < 0)
            throw new ValidationException("Thứ tự hiển thị không được âm");

        return new QuestionOption
        {
            Content = content.Trim(),
            IsCorrect = isCorrect,
            ImageUrl = imageUrl?.Trim(),
            DisplayOrder = displayOrder
        };
    }
}
