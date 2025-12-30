using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetHomeworkStatistics;

public sealed record GetHomeworkStatisticsQuery(
    Guid ClassId,
    Guid HomeworkId) : IRequest<HomeworkStatisticsDto>;

