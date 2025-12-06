using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.StartGame;

public sealed record StartGameCommand(Guid GameSessionId) : IRequest<GameQuestionDto>;

