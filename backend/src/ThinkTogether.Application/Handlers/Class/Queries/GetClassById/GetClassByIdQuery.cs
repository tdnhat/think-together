using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetClassById;

public sealed record GetClassByIdQuery(
    Guid ClassId) : IRequest<ClassDetailDto>;
