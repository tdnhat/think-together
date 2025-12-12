using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.CreateGameSession;

public sealed record CreateGameSessionCommand(Guid QuizSetId) : IRequest<GameSessionDto>;

