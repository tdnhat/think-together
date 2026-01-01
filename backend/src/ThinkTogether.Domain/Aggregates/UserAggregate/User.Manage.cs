using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Domain.Aggregates.UserAggregate;

public sealed partial class User
{
    public void UpdateDetails(string firstName, string lastName, string? bio, RoleType role)
    {
        FirstName = firstName;
        LastName = lastName;
        Bio = bio;
        Role = role;
    }

    public void Deactivate()
    {
        IsActive = false;
    }

    public void Activate()
    {
        IsActive = true;
    }
}
