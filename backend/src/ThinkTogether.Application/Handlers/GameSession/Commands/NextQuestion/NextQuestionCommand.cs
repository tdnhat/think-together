using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.GameSession.Commands.NextQuestion;

public sealed record NextQuestionCommand(Guid GameSessionId) : IRequest<NextQuestionResult>;

public sealed record NextQuestionResult(
    bool HasMoreQuestions,
    GameQuestionDto? Question,
    List<LeaderboardEntryDto> Leaderboard);

