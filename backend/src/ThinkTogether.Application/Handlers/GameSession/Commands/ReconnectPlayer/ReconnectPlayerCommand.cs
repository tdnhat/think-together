﻿using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.ReconnectPlayer;

public sealed record ReconnectPlayerCommand(
    string Pin,
    Guid PlayerId,
    string? ConnectionId = null) : IRequest<ReconnectPlayerResult>;

public sealed record ReconnectPlayerResult(
    bool Success,
    GameSessionDto? GameSession,
    GamePlayerDto? Player,
    GameQuestionDto? CurrentQuestion,
    List<LeaderboardEntryDto>? Leaderboard)
{
    public static ReconnectPlayerResult Failed() => new(false, null, null, null, null);
}

