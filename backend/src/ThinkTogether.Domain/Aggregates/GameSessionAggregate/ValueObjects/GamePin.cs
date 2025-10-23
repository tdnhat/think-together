using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.GameSessionAggregate.ValueObjects;

public sealed class GamePin : ValueObject
{
    public string Value { get; }

    private GamePin(string value)
    {
        Value = value;
    }

    public static GamePin Create(string pin)
    {
        if (string.IsNullOrWhiteSpace(pin))
            throw new ValidationException("Mã PIN là bắt buộc");

        pin = pin.Trim().ToUpperInvariant();

        if (pin.Length != 6)
            throw new ValidationException("Mã PIN phải có đúng 6 chữ số");

        if (!pin.All(char.IsDigit))
            throw new ValidationException("Mã PIN chỉ được chứa chữ số");

        return new GamePin(pin);
    }

    public static GamePin Generate()
    {
        var random = new Random();
        var pin = random.Next(100000, 999999).ToString();
        return new GamePin(pin);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    public static implicit operator string(GamePin pin) => pin.Value;
}

