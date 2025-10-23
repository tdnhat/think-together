using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.ValueObjects;

public sealed class PlayerNickname : ValueObject
{
    public string Value { get; }

    private PlayerNickname(string value)
    {
        Value = value;
    }

    public static PlayerNickname Create(string nickname)
    {
        if (string.IsNullOrWhiteSpace(nickname))
            throw new ValidationException("Tên người tham gia là bắt buộc");

        nickname = nickname.Trim();

        if (nickname.Length < 2)
            throw new ValidationException("Tên người tham gia quá ngắn");

        if (nickname.Length > 100)
            throw new ValidationException("Tên người tham gia quá dài");

        return new PlayerNickname(nickname);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    public static implicit operator string(PlayerNickname nickname) => nickname.Value;
}

