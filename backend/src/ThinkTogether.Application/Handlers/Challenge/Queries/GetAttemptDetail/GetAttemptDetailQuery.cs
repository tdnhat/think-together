using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetAttemptDetail;

public record GetAttemptDetailQuery(Guid AttemptId) : IRequest<ChallengeAttemptDto>;
