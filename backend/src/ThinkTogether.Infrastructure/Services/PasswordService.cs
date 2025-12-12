using ThinkTogether.Domain.Aggregates.UserAggregate.Services;
using ThinkTogether.Domain.Aggregates.UserAggregate.ValueObjects;

namespace ThinkTogether.Infrastructure.Services;

public class PasswordService : IPasswordService
{
    public Password HashPassword(string plainTextPassword)
    {
        var hashedValue = BCrypt.Net.BCrypt.HashPassword(plainTextPassword);
        return Password.CreateFromHash(hashedValue);
    }

    public bool VerifyPassword(string plainTextPassword, Password hashedPassword)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(plainTextPassword, hashedPassword.HashedValue);
        }
        catch
        {
            return false;
        }
    }
}
