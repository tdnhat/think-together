using MediatR;
using ThinkTogether.Application.DTOs;

namespace Application.Handlers.User.Queries.GetCurrentUser;

public sealed record GetCurrentUserQuery() : IRequest<UserDto>;
