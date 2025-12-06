using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Queries.GetLeaderboard;

public sealed record GetLeaderboardQuery(Guid GameSessionId) : IRequest<List<LeaderboardEntryDto>>;
