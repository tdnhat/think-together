using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByShareLink;

public sealed record GetChallengeByShareLinkQuery(string ShareLink) : IRequest<ChallengeDto>;

