using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.GameSession.Commands.EndGame;
using ThinkTogether.Application.Handlers.GameSession.Commands.NextQuestion;
using ThinkTogether.Application.Handlers.GameSession.Commands.StartGame;

namespace ThinkTogether.Api.Controllers.Gaming;

public partial class GameSessionController
{
    [HttpPost("{id:guid}/start")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<GameQuestionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> StartGame(
        Guid id,
        CancellationToken cancellationToken)
    {
        var command = new StartGameCommand(id);
        var result = await _mediator.Send(command, cancellationToken);

        _ = _notificationService.NotifyGameStartedAsync(id, result);

        return Ok(new ApiResponse<GameQuestionDto>
        {
            Success = true,
            Message = "Trò chơi đã bắt đầu",
            Data = result
        });
    }

    [HttpPost("{id:guid}/next-question")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<NextQuestionResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> NextQuestion(
        Guid id,
        CancellationToken cancellationToken)
    {
        var command = new NextQuestionCommand(id);
        var result = await _mediator.Send(command, cancellationToken);

        _ = _notificationService.NotifyNextQuestionAsync(id, result.Leaderboard, result.Question);

        return Ok(new ApiResponse<NextQuestionResult>
        {
            Success = true,
            Data = result
        });
    }

    [HttpPost("{id:guid}/end")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<GameResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> EndGame(
        Guid id,
        CancellationToken cancellationToken)
    {
        var command = new EndGameCommand(id);
        var result = await _mediator.Send(command, cancellationToken);

        _ = _notificationService.NotifyGameEndedAsync(id, result);

        return Ok(new ApiResponse<GameResultDto>
        {
            Success = true,
            Message = "Trò chơi đã kết thúc",
            Data = result
        });
    }
}
