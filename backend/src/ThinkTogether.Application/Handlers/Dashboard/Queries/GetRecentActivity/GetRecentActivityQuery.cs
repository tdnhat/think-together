using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Dashboard.Queries.GetRecentActivity;

public record GetRecentActivityQuery : IRequest<List<QuizSetDto>>;
