using System.Text.RegularExpressions;
using Domain.Exceptions;

namespace Domain.Aggregates.UserAggregate.ValueObjects;

public sealed record Email(string Value)
{
    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public static Email Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        throw new ValidationException("Email là bắt buộc");

        email = email.Trim().ToLowerInvariant();

        if (email.Length > 255)
        throw new ValidationException("Email quá dài");

        if (!EmailRegex.IsMatch(email))
        throw new ValidationException("Định dạng email không hợp lệ");

        return new Email(email);
    }

    public override string ToString() => Value;

    public static implicit operator string(Email email) => email.Value;
}

