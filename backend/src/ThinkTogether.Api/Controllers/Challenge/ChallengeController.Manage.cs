using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models.RequestModels.Challenge;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Challenge.Commands.CreateChallenge;

namespace ThinkTogether.Api.Controllers.Challenge;

public partial class ChallengeController
{
    [HttpPost]
    [ProducesResponseType(typeof(ChallengeDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateChallenge(
        [FromBody] CreateChallengeRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateChallengeCommand(
            QuizSetId: request.QuizSetId,
            Title: request.Title ?? $"Challenge for Quiz Set {request.QuizSetId}");

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetLeaderboard),
            new { challengeId = result.Id }, result);
    }
}
