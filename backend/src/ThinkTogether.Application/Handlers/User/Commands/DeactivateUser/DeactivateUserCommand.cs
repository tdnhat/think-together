using MediatR;

namespace ThinkTogether.Application.Handlers.User.Commands.DeactivateUser;

public record DeactivateUserCommand(Guid Id) : IRequest;
