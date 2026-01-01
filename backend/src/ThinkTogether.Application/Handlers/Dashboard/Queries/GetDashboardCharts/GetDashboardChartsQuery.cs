using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Dashboard.Queries.GetDashboardCharts;

public record GetDashboardChartsQuery : IRequest<DashboardChartsDto>;
