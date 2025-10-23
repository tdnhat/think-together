using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.QuizSetAggregate.ValueObjects;

public sealed class Answer : ValueObject
{
    public string Content { get; private set; }

    public bool IsCorrect { get; private set; }

    public int Order { get; private set; }

    public string? ImageUrl { get; private set; }

    private Answer()
    {
        Content = null!;
    }

    private Answer(string content, bool isCorrect, int order, string? imageUrl = null)
    {
        Content = content;
        IsCorrect = isCorrect;
        Order = order;
        ImageUrl = imageUrl;
    }

    public static Answer Create(string content, bool isCorrect, int order, string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ValidationException("Nội dung câu trả lời là bắt buộc");

        if (content.Length > 5000)
            throw new ValidationException("Nội dung câu trả lời quá dài");

        if (order < 1 || order > 6)
            throw new ValidationException("Thứ tự câu trả lời phải từ 1 đến 6");

        if (imageUrl != null && imageUrl.Length > 500)
            throw new ValidationException("URL ảnh quá dài");

        return new Answer(content.Trim(), isCorrect, order, imageUrl?.Trim());
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Content;
        yield return IsCorrect;
        yield return Order;
        yield return ImageUrl;
    }
}