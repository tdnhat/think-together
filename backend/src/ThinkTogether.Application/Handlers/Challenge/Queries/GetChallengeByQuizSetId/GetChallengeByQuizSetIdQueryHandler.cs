using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByQuizSetId;

public sealed class GetChallengeByQuizSetIdQueryHandler : IRequestHandler<GetChallengeByQuizSetIdQuery, ChallengeDto?>
{
    private readonly IChallengeRepository _challengeRepository;

    public GetChallengeByQuizSetIdQueryHandler(IChallengeRepository challengeRepository)
    {
        _challengeRepository = challengeRepository;
    }

    public async Task<ChallengeDto?> Handle(GetChallengeByQuizSetIdQuery request, CancellationToken cancellationToken)
    {
        var spec = new ChallengeByQuizSetIdSpec(request.QuizSetId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken);

        if (challenge == null)
            return null;

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

