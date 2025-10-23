using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.User.Commands.RefreshToken;

public sealed record RefreshTokenCommand(string Token) : IRequest<AuthTokenDto>;
