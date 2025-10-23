using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.QuizSetAggregate.ValueObjects;

public sealed class MatchPair : ValueObject
{
    public string LeftContent { get; private set; }

    public string RightContent { get; private set; }

    public int Order { get; private set; }

    private MatchPair()
    {
        LeftContent = null!;
        RightContent = null!;
    }

    private MatchPair(string leftContent, string rightContent, int order)
    {
        LeftContent = leftContent;
        RightContent = rightContent;
        Order = order;
    }

    public static MatchPair Create(string leftContent, string rightContent, int order)
    {
        if (string.IsNullOrWhiteSpace(leftContent))
            throw new ValidationException("Nội dung bên trái là bắt buộc");

        if (string.IsNullOrWhiteSpace(rightContent))
            throw new ValidationException("Nội dung bên phải là bắt buộc");

        if (leftContent.Length > 5000)
            throw new ValidationException("Nội dung bên trái quá dài");

        if (rightContent.Length > 5000)
            throw new ValidationException("Nội dung bên phải quá dài");

        if (order < 1 || order > 5)
            throw new ValidationException("Thứ tự cặp ghép phải từ 1 đến 5");

        return new MatchPair(leftContent.Trim(), rightContent.Trim(), order);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return LeftContent;
        yield return RightContent;
        yield return Order;
    }
}

