using MediatR;

namespace ThinkTogether.Application.Handlers.User.Queries.GetUserCreatorStatus;

public sealed class GetUserCreatorStatusQuery : IRequest<UserCreatorStatusDto>
{
}

public sealed class UserCreatorStatusDto
{
    public bool IsCreator { get; set; }
    public bool IsAdmin { get; set; }
}
