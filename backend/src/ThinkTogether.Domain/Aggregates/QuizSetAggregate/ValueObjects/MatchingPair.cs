using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;

public record MatchingPair
{
    public string LeftContent { get; init; } = string.Empty;

    public string RightContent { get; init; } = string.Empty;

    public int DisplayOrder { get; init; }

    private MatchingPair()
    {
    }

    public static MatchingPair Create(
        string leftContent,
        string rightContent,
        int displayOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(leftContent))
            throw new ValidationException("Nội dung bên trái không được trống");

        if (string.IsNullOrWhiteSpace(rightContent))
            throw new ValidationException("Nội dung bên phải không được trống");

        if (leftContent.Length > 500)
            throw new ValidationException("Nội dung bên trái không được vượt quá 500 ký tự");

        if (rightContent.Length > 500)
            throw new ValidationException("Nội dung bên phải không được vượt quá 500 ký tự");

        if (displayOrder < 0)
            throw new ValidationException("Thứ tự hiển thị không được âm");

        return new MatchingPair
        {
            LeftContent = leftContent.Trim(),
            RightContent = rightContent.Trim(),
            DisplayOrder = displayOrder
        };
    }
}
