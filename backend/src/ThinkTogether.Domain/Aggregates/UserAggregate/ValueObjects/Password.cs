using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;

public sealed record Password(string HashedValue)
{
    public static Password CreateFromHash(string hashedPassword)
    {
        if (string.IsNullOrWhiteSpace(hashedPassword))
        throw new ValidationException("Mật khẩu là bắt buộc");

        return new Password(hashedPassword);
    }

    public static void ValidatePlainText(string plainTextPassword)
    {
        if (string.IsNullOrWhiteSpace(plainTextPassword))
        throw new ValidationException("Mật khẩu là bắt buộc");

        if (plainTextPassword.Length < 8)
        throw new ValidationException("Mật khẩu phải có ít nhất 8 ký tự");

        if (plainTextPassword.Length > 100)
        throw new ValidationException("Mật khẩu quá dài");
    }

    public static implicit operator string(Password password) => password.HashedValue;
}
