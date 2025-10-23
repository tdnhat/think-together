using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.ValueObjects;

public sealed class Score : ValueObject
{
    public int Value { get; }

    private Score(int value)
    {
        Value = value;
    }

    public static Score Create(int value)
    {
        if (value < 0)
            throw new ValidationException("Điểm số không được âm");

        return new Score(value);
    }

    public static Score Zero() => new(0);

    public Score Add(int points)
    {
        if (points < 0)
            throw new ValidationException("Không thể cộng điểm số âm");

        return new Score(Value + points);
    }

    public Score Subtract(int points)
    {
        if (points < 0)
            throw new ValidationException("Không thể trừ điểm số âm");

        var newValue = Value - points;
        if (newValue < 0)
            newValue = 0;

        return new Score(newValue);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value.ToString();

    public static implicit operator int(Score score) => score.Value;

    public static bool operator >(Score left, Score right) => left.Value > right.Value;
    public static bool operator <(Score left, Score right) => left.Value < right.Value;
    public static bool operator >=(Score left, Score right) => left.Value >= right.Value;
    public static bool operator <=(Score left, Score right) => left.Value <= right.Value;
}

