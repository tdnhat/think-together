using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.StartChallengeAttempt;

public sealed record StartChallengeAttemptCommand(
    Guid ChallengeId,
    string Nickname,
    Guid? UserId = null) : IRequest<ChallengeAttemptDto>;
