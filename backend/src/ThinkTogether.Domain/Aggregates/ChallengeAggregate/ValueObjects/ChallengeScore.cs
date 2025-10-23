using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.ChallengeAggregate.ValueObjects;

public sealed class ChallengeScore : ValueObject
{
    public int Value { get; }

    private ChallengeScore(int value)
    {
        Value = value;
    }

    public static ChallengeScore Create(int value)
    {
        if (value < 0)
            throw new ValidationException("Điểm số thách thức không được âm");

        return new ChallengeScore(value);
    }

    public static ChallengeScore Zero() => new(0);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value.ToString();

    public static implicit operator int(ChallengeScore score) => score.Value;

    public static bool operator >(ChallengeScore left, ChallengeScore right) => left.Value > right.Value;
    public static bool operator <(ChallengeScore left, ChallengeScore right) => left.Value < right.Value;
    public static bool operator >=(ChallengeScore left, ChallengeScore right) => left.Value >= right.Value;
    public static bool operator <=(ChallengeScore left, ChallengeScore right) => left.Value <= right.Value;
}

