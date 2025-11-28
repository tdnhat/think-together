using Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;

public record OrderingItem
{
    public string Content { get; init; } = string.Empty;

    public int CorrectPosition { get; init; }

    private OrderingItem()
    {
    }

    public static OrderingItem Create(
        string content,
        int correctPosition)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ValidationException("Nội dung không được trống");

        if (content.Length > 500)
            throw new ValidationException("Nội dung không được vượt quá 500 ký tự");

        if (correctPosition < 1)
            throw new ValidationException("Vị trí đúng phải lớn hơn 0");

        return new OrderingItem
        {
            Content = content.Trim(),
            CorrectPosition = correctPosition
        };
    }
}

