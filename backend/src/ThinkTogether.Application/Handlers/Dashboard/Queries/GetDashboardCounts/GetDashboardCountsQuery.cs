using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Dashboard.Queries.GetDashboardCounts;

public record GetDashboardCountsQuery : IRequest<DashboardCountsDto>;
