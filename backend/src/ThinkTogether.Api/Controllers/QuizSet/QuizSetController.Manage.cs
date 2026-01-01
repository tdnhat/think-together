using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.PublishQuizSet;
using ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuizSet;

namespace ThinkTogether.Api.Controllers.QuizSet;

public partial class QuizSetController
{
    [HttpPost]
    [ProducesResponseType(typeof(QuizSetDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateQuizSet(
        [FromBody] CreateQuizSetCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetAllQuizSets), null, result
        );
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(QuizSetDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateQuizSet(
        Guid id,
        [FromBody] UpdateQuizSetCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { Id = id };
        var result = await _mediator.Send(commandWithId, cancellationToken);

        return Ok(result
        );
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteQuizSet(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteQuizSetCommand(id), cancellationToken);

        return NoContent();
    }

    [HttpPost("{id}/publish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PublishQuizSet(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new PublishQuizSetCommand(id), cancellationToken);

        return NoContent();
    }

    [HttpPost("{id}/duplicate")]
    [ProducesResponseType(typeof(QuizSetDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DuplicateQuizSet(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DuplicateQuizSetCommand(id), cancellationToken);

        return CreatedAtAction(
            nameof(GetQuizSetById),
            new { id = result.Id }, result
            );
    }
}
