using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.User.Queries.GetUserById;

public record GetUserByIdQuery(Guid Id) : IRequest<UserDto>;
