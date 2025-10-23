using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.QuizSetAggregate.ValueObjects;

public sealed class OrderItem : ValueObject
{
    public string Content { get; private set; }

    public int CorrectPosition { get; private set; }

    private OrderItem()
    {
        Content = null!;
    }

    private OrderItem(string content, int correctPosition)
    {
        Content = content;
        CorrectPosition = correctPosition;
    }

    public static OrderItem Create(string content, int correctPosition)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ValidationException("Nội dung mục sắp xếp là bắt buộc");

        if (content.Length > 5000)
            throw new ValidationException("Nội dung mục sắp xếp quá dài");

        if (correctPosition < 1 || correctPosition > 6)
            throw new ValidationException("Vị trí đúng phải từ 1 đến 6");

        return new OrderItem(content.Trim(), correctPosition);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Content;
        yield return CorrectPosition;
    }
}