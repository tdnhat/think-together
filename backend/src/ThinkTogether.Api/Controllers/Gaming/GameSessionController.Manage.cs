using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.Handlers.GameSession.Commands.AbandonActiveSession;

namespace ThinkTogether.Api.Controllers.Gaming;

public partial class GameSessionController
{
    [HttpPost("abandon-active")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> AbandonActiveSession(CancellationToken cancellationToken)
    {
        var command = new AbandonActiveSessionCommand();
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = result ? "Đã hủy phiên trò chơi cũ" : "Không có phiên trò chơi nào để hủy",
            Data = result
        });
    }
}
