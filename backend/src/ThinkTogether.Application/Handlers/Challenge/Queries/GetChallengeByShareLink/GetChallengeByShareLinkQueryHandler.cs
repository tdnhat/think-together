using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByShareLink;

public sealed class GetChallengeByShareLinkQueryHandler : IRequestHandler<GetChallengeByShareLinkQuery, ChallengeDto>
{
    private readonly IChallengeRepository _challengeRepository;

    public GetChallengeByShareLinkQueryHandler(IChallengeRepository challengeRepository)
    {
        _challengeRepository = challengeRepository;
    }

    public async Task<ChallengeDto> Handle(GetChallengeByShareLinkQuery request, CancellationToken cancellationToken)
    {
        var spec = new ChallengeByShareLinkSpec(request.ShareLink);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException(nameof(Challenge), request.ShareLink);

        return new ChallengeDto
        {
            Id = challenge.Id,
            CreatorId = challenge.CreatorId,
            QuizSetId = challenge.QuizSetId,
            Title = challenge.Title,
            Description = challenge.Description,
            ShareLink = challenge.ShareLink,
            Status =  challenge.Status,
            ShowLeaderboard = challenge.ShowLeaderboard,
            PlayCount = challenge.PlayCount,
            CreatedAt = challenge.CreatedAt,
            UpdatedAt = challenge.UpdatedAt
        };
    }
}

