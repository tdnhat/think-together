using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Queries.GetGameSession;

public sealed record GetGameSessionQuery(Guid GameSessionId) : IRequest<GameSessionDto>;

