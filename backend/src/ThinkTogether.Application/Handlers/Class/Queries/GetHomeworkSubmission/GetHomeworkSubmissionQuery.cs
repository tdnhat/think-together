using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetHomeworkSubmission;

public sealed record GetHomeworkSubmissionQuery(
    Guid ClassId,
    Guid HomeworkId,
    Guid? StudentId = null) : IRequest<HomeworkSubmissionDetailDto>;

