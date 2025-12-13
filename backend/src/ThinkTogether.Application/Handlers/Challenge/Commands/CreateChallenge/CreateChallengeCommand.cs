using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.CreateChallenge;

public sealed record CreateChallengeCommand(
    Guid QuizSetId,
    string Title,
    string? Description = null,
    bool ShowLeaderboard = true) : IRequest<ChallengeDto>;

