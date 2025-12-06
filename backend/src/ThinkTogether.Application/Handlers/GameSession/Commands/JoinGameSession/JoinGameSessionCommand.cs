using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.JoinGameSession;

public sealed record JoinGameSessionCommand(string Pin, string Nickname) : IRequest<GamePlayerDto>;

