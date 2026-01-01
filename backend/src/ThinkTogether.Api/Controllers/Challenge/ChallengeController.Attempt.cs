using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models.RequestModels.Challenge;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Challenge.Commands.StartChallengeAttempt;
using ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswers;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeAttempt;

namespace ThinkTogether.Api.Controllers.Challenge;

public partial class ChallengeController
{
    [HttpPost("{challengeId:guid}/attempts")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ChallengeAttemptDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> StartAttempt(
        Guid challengeId,
        [FromBody] StartChallengeAttemptRequest request,
        CancellationToken cancellationToken)
    {
        var command = new StartChallengeAttemptCommand(
            challengeId,
            request.Nickname,
            request.UserId,
            request.HomeworkId);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }

    [HttpGet("attempts/{attemptId:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ChallengeAttemptDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAttempt(
        Guid attemptId,
        CancellationToken cancellationToken)
    {
        var query = new GetChallengeAttemptQuery(attemptId);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpPost("attempts/{attemptId:guid}/submit-answers")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ChallengeAttemptDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SubmitAnswers(
        Guid attemptId,
        [FromBody] SubmitAnswersRequest request,
        CancellationToken cancellationToken)
    {
        var answers = request.Answers.Select(a => new AnswerSubmissionDto(
            a.QuestionId,
            a.SelectedOptionIndexes,
            a.MatchingPairs,
            a.OrderingItems
        )).ToList();

        var command = new SubmitAnswersCommand(attemptId, answers, request.HomeworkId);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }
}
