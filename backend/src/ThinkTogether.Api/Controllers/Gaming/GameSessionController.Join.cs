using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models.RequestModels.Gaming;
using ThinkTogether.Application.Handlers.GameSession.Commands.JoinGameSession;
using ThinkTogether.Api.Models.ResponseModels.Gaming;
using ThinkTogether.Application.Handlers.GameSession.Commands.ReconnectPlayer;

namespace ThinkTogether.Api.Controllers.Gaming;

public partial class GameSessionController
{
    [HttpPost("join")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(JoinGameResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> JoinGameSession(
        [FromBody] JoinGameSessionRequest request,
        CancellationToken cancellationToken)
    {
        var command = new JoinGameSessionCommand(request.Pin, request.Nickname);
        var result = await _mediator.Send(command, cancellationToken);


        return Ok(new JoinGameResponse
        {
            PlayerId = result.Id,
            Nickname = result.Nickname,
            Pin = request.Pin
        });
    }

    [HttpPost("reconnect")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ReconnectPlayerResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> ReconnectPlayer(
        [FromBody] ReconnectPlayerRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ReconnectPlayerCommand(request.Pin, request.PlayerId);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result
        );
    }
}
