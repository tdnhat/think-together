using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.GameSession.Commands.CreateGameSession;

namespace ThinkTogether.Api.Controllers.Gaming;

public partial class GameSessionController
{
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(GameSessionDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateGameSession(
        [FromBody] CreateGameSessionCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetGameSession),
            new { id = result.Id }, result
            );
    }
}
