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

    /// <summary>
    /// Get all classes for current user
    /// </summary>
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

    /// <summary>
    /// Get class by ID
    /// </summary>
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

    /// <summary>
    /// Create a new class
    /// </summary>
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

    /// <summary>
    /// Join class by join code
    /// </summary>
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

    /// <summary>
    /// Get homeworks for a class
    /// </summary>
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

    /// <summary>
    /// Create homework for a class
    /// </summary>
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
}

/// <summary>
/// Request DTO for creating homework
/// </summary>
public record CreateHomeworkRequest(
    Guid QuizSetId,
    string Title,
    DateTime? DueDate = null);
