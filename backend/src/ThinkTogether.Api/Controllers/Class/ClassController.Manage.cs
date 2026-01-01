using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models.RequestModels.Class;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Class.Commands.CreateClass;
using ThinkTogether.Application.Handlers.Class.Commands.JoinClass;

namespace ThinkTogether.Api.Controllers.Class;

public partial class ClassController
{
    [HttpPost]
    [ProducesResponseType(typeof(ClassDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateClass(
        [FromBody] CreateClassRequest request,
        CancellationToken cancellationToken = default)
    {
        var command = new CreateClassCommand(
            Name: request.Name,
            Description: request.Description,
            CoverImageUrl: request.CoverImageUrl);

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetClassById),
            new { id = result.Id }, result);
    }

    [HttpPost("join")]
    [ProducesResponseType(typeof(ClassDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> JoinClass(
        [FromBody] JoinClassRequest request,
        CancellationToken cancellationToken = default)
    {
        var command = new JoinClassCommand(JoinCode: request.ClassCode);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }
}
