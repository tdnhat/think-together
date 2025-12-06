using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Api.Models.RequestModels.Gaming;
using ThinkTogether.Api.Models.ResponseModels.Gaming;
using ThinkTogether.Application.Handlers.GameSession.Commands.JoinGameSession;
using ThinkTogether.Application.Handlers.GameSession.Commands.ReconnectPlayer;

namespace ThinkTogether.Api.Controllers.Gaming;

public partial class GameSessionController
{
    [HttpPost("join")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<JoinGameResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> JoinGameSession(
        [FromBody] JoinGameSessionRequest request,
        CancellationToken cancellationToken)
    {
        var command = new JoinGameSessionCommand(request.Pin, request.Nickname);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<JoinGameResponse>
        {
            Success = true,
            Message = "Đã tham gia phiên trò chơi thành công",
            Data = new JoinGameResponse
            {
                PlayerId = result.Id,
                Nickname = result.Nickname,
                Pin = request.Pin
            }
        });
    }

    /// <summary>
    /// Reconnect a player to an ongoing game session.
    /// </summary>
    [HttpPost("reconnect")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ReconnectPlayerResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ReconnectPlayer(
        [FromBody] ReconnectPlayerRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ReconnectPlayerCommand(request.Pin, request.PlayerId);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<ReconnectPlayerResult>
        {
            Success = true,
            Message = "Đã kết nối lại thành công",
            Data = result
        });
    }
}
