using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuestion;
using ThinkTogether.Application.Handlers.QuizSet.Commands.DeleteQuestion;
using ThinkTogether.Application.Handlers.QuizSet.Commands.DuplicateQuestion;
using ThinkTogether.Application.Handlers.QuizSet.Commands.ReorderQuestions;
using ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuestion;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuestionById;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuestionsByQuizSetId;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Api.Controllers.QuizSet;

public partial class QuizSetController
{
    [HttpGet("{id}/questions")]
    [ProducesResponseType(typeof(PaginatedResponse<QuestionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetQuestionsByQuizSetId(
        Guid id,
        [FromQuery] string? search,
        [FromQuery] string? filterBy,
        [FromQuery] string? sortBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetQuestionsByQuizSetIdQuery(id)
        {
            Search = search,
            FilterBy = filterBy,
            SortBy = sortBy,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}/questions/{questionId}")]
    [ProducesResponseType(typeof(QuestionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetQuestionById(Guid id, Guid questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetQuestionByIdQuery(id, questionId), cancellationToken);

        return Ok(result
        );
    }

    [HttpPost("{id}/questions")]
    [ProducesResponseType(typeof(QuestionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateQuestion(
        Guid id,
        [FromBody] CreateQuestionCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { QuizSetId = id };
        var result = await _mediator.Send(commandWithId, cancellationToken);

        return CreatedAtAction(
            nameof(GetQuestionById),
            new { id = id, questionId = result.Id },
            result);
    }

    [HttpPut("{id}/questions/{questionId}")]
    [ProducesResponseType(typeof(QuestionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateQuestion(
        Guid id,
        Guid questionId,
        [FromBody] UpdateQuestionCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithIds = command with { QuizSetId = id, QuestionId = questionId };
        var result = await _mediator.Send(commandWithIds, cancellationToken);

        return Ok(result
        );
    }

    [HttpDelete("{id}/questions/{questionId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteQuestion(Guid id, Guid questionId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteQuestionCommand(id, questionId), cancellationToken);

        return NoContent();
    }

    [HttpPost("{id}/questions/{questionId}/duplicate")]
    [ProducesResponseType(typeof(QuestionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DuplicateQuestion(Guid id, Guid questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DuplicateQuestionCommand(id, questionId), cancellationToken);

        return CreatedAtAction(
            nameof(GetQuestionById),
            new { id, questionId = result.Id },
            result);
    }

    [HttpPut("{id}/questions/reorder")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ReorderQuestions(
        Guid id,
        [FromBody] ReorderQuestionsCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { QuizSetId = id };
        await _mediator.Send(commandWithId, cancellationToken);

        return NoContent();
    }
}
