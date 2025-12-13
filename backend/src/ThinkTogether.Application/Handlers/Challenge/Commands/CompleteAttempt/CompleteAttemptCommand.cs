using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.CompleteAttempt;

public sealed record CompleteAttemptCommand(Guid AttemptId) : IRequest<ChallengeAttemptDto>;
