using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Class.Commands.CreateClass;
using ThinkTogether.Application.Handlers.Class.Commands.CreateHomework;
using ThinkTogether.Application.Handlers.Class.Commands.JoinClass;
using ThinkTogether.Application.Handlers.Class.Queries.GetClassById;
using ThinkTogether.Application.Handlers.Class.Queries.GetClasses;
using ThinkTogether.Application.Handlers.Class.Queries.GetHomeworks;
using ThinkTogether.Application.Handlers.Class.Queries.GetHomeworkSubmission;
using ThinkTogether.Application.Handlers.Class.Queries.GetHomeworkStatistics;

namespace ThinkTogether.Api.Controllers.Class;

[ApiController]
[Route("api/classes")]
[Authorize]
public class ClassController : ControllerBase
{
    private readonly IMediator _mediator;

    public ClassController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ClassResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetClasses(
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetClassesQuery(
            Search: search,
            Page: page,
            PageSize: pageSize);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<ClassResponseDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpPost("join")]
    [ProducesResponseType(typeof(ApiResponse<ClassDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> JoinClass(
        [FromBody] JoinClassCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<ClassDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpGet("{classId}/homeworks")]
    [ProducesResponseType(typeof(ApiResponse<HomeworkResponseDto>), StatusCodes.Status200OK)]
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

        return Ok(new ApiResponse<HomeworkResponseDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpGet("{classId}/homeworks/{homeworkId}/submission")]
    [ProducesResponseType(typeof(ApiResponse<HomeworkSubmissionDetailDto>), StatusCodes.Status200OK)]
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

        return Ok(new ApiResponse<HomeworkSubmissionDetailDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpGet("{classId}/homeworks/{homeworkId}/statistics")]
    [ProducesResponseType(typeof(ApiResponse<HomeworkStatisticsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHomeworkStatistics(
        [FromRoute] Guid classId,
        [FromRoute] Guid homeworkId,
        CancellationToken cancellationToken = default)
    {
        var query = new GetHomeworkStatisticsQuery(
            ClassId: classId,
            HomeworkId: homeworkId);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<HomeworkStatisticsDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpPost("{classId}/homeworks")]
    [ProducesResponseType(typeof(ApiResponse<HomeworkDto>), StatusCodes.Status201Created)]
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
            new { classId },
            new ApiResponse<HomeworkDto>
            {
                Success = true,
                Data = result
            });
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ClassDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetClassById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetClassByIdQuery(ClassId: id);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<ClassDetailDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ClassDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateClass(
        [FromBody] CreateClassCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetClassById),
            new { id = result.Id },
            new ApiResponse<ClassDto>
            {
                Success = true,
                Data = result
            });
    }
}

public record CreateHomeworkRequest(
    Guid QuizSetId,
    string Title,
    DateTime? DueDate = null);
