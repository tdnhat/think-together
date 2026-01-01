using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.GameSession.Commands.EndGame;
using ThinkTogether.Application.Handlers.GameSession.Commands.NextQuestion;
using ThinkTogether.Application.Handlers.GameSession.Commands.StartGame;

namespace ThinkTogether.Api.Controllers.Gaming;

public partial class GameSessionController
{
    [HttpPost("{id:guid}/start")]
    [Authorize]
    [ProducesResponseType(typeof(GameQuestionDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> StartGame(
        Guid id,
        CancellationToken cancellationToken)
    {
        var command = new StartGameCommand(id);
        var result = await _mediator.Send(command, cancellationToken);

        // Notifications are handled automatically by domain event handlers
        // No need to call notification service here

        return Ok(result
        );
    }

    [HttpPost("{id:guid}/next-question")]
    [Authorize]
    [ProducesResponseType(typeof(NextQuestionResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> NextQuestion(
        Guid id,
        CancellationToken cancellationToken)
    {
        var command = new NextQuestionCommand(id);
        var result = await _mediator.Send(command, cancellationToken);

        // Notifications are handled automatically by domain event handlers
        // No need to call notification service here

        return Ok(result
        );
    }

    [HttpPost("{id:guid}/end")]
    [Authorize]
    [ProducesResponseType(typeof(GameResultDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> EndGame(
        Guid id,
        CancellationToken cancellationToken)
    {
        var command = new EndGameCommand(id);
        var result = await _mediator.Send(command, cancellationToken);

        // Notifications are handled automatically by domain event handlers
        // No need to call notification service here

        return Ok(result
        );
    }
}
