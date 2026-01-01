using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Platform.Queries.GetPlatformStats;

public record GetPlatformStatsQuery : IRequest<PlatformStatsDto>;

