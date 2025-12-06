using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.EndGame;

public sealed record EndGameCommand(Guid GameSessionId) : IRequest<GameResultDto>;

