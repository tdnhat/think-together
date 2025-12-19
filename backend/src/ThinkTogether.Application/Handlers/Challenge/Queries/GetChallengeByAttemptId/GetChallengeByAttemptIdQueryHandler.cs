using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeAttempt;

public sealed class GetChallengeByAttemptIdQueryHandler : IRequestHandler<GetChallengeByAttemptIdQuery, ChallengeDto>
{
    private readonly IChallengeRepository _challengeRepository;

    public GetChallengeByAttemptIdQueryHandler(IChallengeRepository challengeRepository)
    {
        _challengeRepository = challengeRepository;
    }

    public async Task<ChallengeDto> Handle(GetChallengeByAttemptIdQuery request, CancellationToken cancellationToken)
    {
        var spec = new ChallengeByAttemptIdSpec(request.AttemptId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.AttemptId);

        return MapToDto(challenge);
    }

    private static ChallengeDto MapToDto(Domain.Aggregates.ChallengeAggregate.Challenge challenge)
    {
        return new ChallengeDto
        {
            Id = challenge.Id,
            CreatorId = challenge.CreatorId,
            QuizSetId = challenge.QuizSetId,
            Title = challenge.Title,
            Description = challenge.Description,
            ShareLink = challenge.ShareLink,
            Status = challenge.Status,
            ShowLeaderboard = challenge.ShowLeaderboard,
            PlayCount = challenge.PlayCount,
            CreatedAt = challenge.CreatedAt,
            UpdatedAt = challenge.UpdatedAt
        };
    }
}
