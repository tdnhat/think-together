using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;

namespace ThinkTogether.Domain.Aggregates.UserAggregate.Services;

public interface IPasswordService
{
    Password HashPassword(string plainTextPassword);
    bool VerifyPassword(string plainTextPassword, Password hashedPassword);
}
