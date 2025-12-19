using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetHomeworks;

public sealed record GetHomeworksQuery(
    Guid ClassId,
    int Page = 1,
    int PageSize = 20) : IRequest<HomeworkResponseDto>;
