using Application.DTOs;
using MediatR;

namespace Application.Handlers.User.Queries.GetCurrentUser;

public sealed record GetCurrentUserQuery() : IRequest<UserDto>;
