using Domain.Aggregates.UserAggregate.Entities;
using Domain.Aggregates.UserAggregate.ValueObjects;
using ThinkTogether.Domain.Aggregates.UserAggregate.Entities;

namespace Domain.Aggregates.UserAggregate.Specifications;

public static class UserSpecifications
{
    public static Func<User, bool> IsActive => user => !user.IsDeleted;

    public static Func<User, bool> IsAdministrator => user => user.Role == UserRole.QUANTRI;

    public static Func<User, bool> IsTeacher => user => user.Role == UserRole.GIAOVIEN;

    public static Func<User, bool> HasEmail(Email email) => user => user.Email == email;

    public static Func<User, bool> CreatedAfter(DateTime date) => user => user.CreatedAt > date;

    public static Func<User, bool> HasRefreshToken(RefreshToken refreshToken) =>
        user => user.RefreshTokens.Contains(refreshToken);
}