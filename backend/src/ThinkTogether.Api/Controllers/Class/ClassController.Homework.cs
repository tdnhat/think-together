using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models.RequestModels.Class;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Class.Commands.CreateHomework;
using ThinkTogether.Application.Handlers.Class.Queries.GetHomeworks;
using ThinkTogether.Application.Handlers.Class.Queries.GetHomeworkStatistics;
using ThinkTogether.Application.Handlers.Class.Queries.GetHomeworkSubmission;

namespace ThinkTogether.Api.Controllers.Class;

public partial class ClassController
{
    [HttpGet("{classId}/homeworks")]
    [ProducesResponseType(typeof(HomeworkResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHomeworks(
        [FromRoute] Guid classId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetHomeworksQuery(
            ClassId: classId,
            Page: page,
            PageSize: pageSize);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpPost("{classId}/homeworks")]
    [ProducesResponseType(typeof(HomeworkResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateHomework(
        [FromRoute] Guid classId,
        [FromBody] CreateHomeworkRequest request,
        CancellationToken cancellationToken = default)
    {
        var command = new CreateHomeworkCommand(
            ClassId: classId,
            QuizSetId: request.QuizSetId,
            Title: request.Title,
            DueDate: request.DueDate);

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetHomeworks),
            new { classId }, result);
    }

    [HttpGet("{classId}/homeworks/{homeworkId}/submission")]
    [ProducesResponseType(typeof(HomeworkSubmissionDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHomeworkSubmission(
        [FromRoute] Guid classId,
        [FromRoute] Guid homeworkId,
        [FromQuery] Guid? studentId = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetHomeworkSubmissionQuery(
            ClassId: classId,
            HomeworkId: homeworkId,
            StudentId: studentId);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{classId}/homeworks/{homeworkId}/statistics")]
    [ProducesResponseType(typeof(HomeworkStatisticsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHomeworkStatistics(
        [FromRoute] Guid classId,
        [FromRoute] Guid homeworkId,
        CancellationToken cancellationToken = default)
    {
        var query = new GetHomeworkStatisticsQuery(
            ClassId: classId,
            HomeworkId: homeworkId);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }
}
