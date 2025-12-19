using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetClasses;

public sealed record GetClassesQuery(
    string? Search = null,
    int Page = 1,
    int PageSize = 20) : IRequest<ClassResponseDto>;
