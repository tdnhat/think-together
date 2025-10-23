using Application.DTOs;
using MediatR;

namespace Application.Handlers.User.Commands.RefreshToken;

public sealed record RefreshTokenCommand(string Token) : IRequest<AuthTokenDto>;
