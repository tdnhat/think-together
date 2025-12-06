using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Queries.GetGameSessionByPin;

public sealed record GetGameSessionByPinQuery(string Pin) : IRequest<GameSessionDto>;

