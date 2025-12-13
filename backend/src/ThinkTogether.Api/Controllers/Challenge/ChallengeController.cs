using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Challenge.Commands.CompleteAttempt;
using ThinkTogether.Application.Handlers.Challenge.Commands.CreateChallenge;
using ThinkTogether.Application.Handlers.Challenge.Commands.FlagQuestion;
using ThinkTogether.Application.Handlers.Challenge.Commands.NavigateQuestion;
using ThinkTogether.Application.Handlers.Challenge.Commands.StartChallengeAttempt;
using ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswer;
using ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswers;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeAttempt;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByQuizSetId;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByShareLink;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetLeaderboard;

namespace ThinkTogether.Api.Controllers.Challenge;

[ApiController]
[Route("api/challenges")]
public class ChallengeController : ControllerBase
{
    private readonly IMediator _mediator;

    public ChallengeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Create a new challenge from a quiz set
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ChallengeDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateChallenge(
        [FromBody] CreateChallengeCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetLeaderboard),
            new { challengeId = result.Id },
            new ApiResponse<ChallengeDto>
            {
                Success = true,
                Message = "Thử thách đã được tạo thành công",
                Data = result
            });
    }

    /// <summary>
    /// Get challenge by share link
    /// </summary>
    [HttpGet("by-link/{shareLink}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ChallengeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChallengeByShareLink(
        string shareLink,
        CancellationToken cancellationToken)
    {
        var query = new GetChallengeByShareLinkQuery(shareLink);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<ChallengeDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Get challenge by quiz set ID
    /// </summary>
    [HttpGet("by-quiz/{quizSetId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ChallengeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ChallengeDto>), StatusCodes.Status204NoContent)]
    public async Task<IActionResult> GetChallengeByQuizSetId(
        Guid quizSetId,
        CancellationToken cancellationToken)
    {
        var query = new GetChallengeByQuizSetIdQuery(quizSetId);
        var result = await _mediator.Send(query, cancellationToken);

        if (result == null)
        {
            return NoContent();
        }

        return Ok(new ApiResponse<ChallengeDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Start a new challenge attempt
    /// </summary>
    [HttpPost("{challengeId:guid}/attempts")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ChallengeAttemptDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> StartAttempt(
        Guid challengeId,
        [FromBody] StartChallengeAttemptRequest request,
        CancellationToken cancellationToken)
    {
        var command = new StartChallengeAttemptCommand(
            challengeId,
            request.Nickname,
            request.UserId);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<ChallengeAttemptDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Get challenge attempt details
    /// </summary>
    [HttpGet("attempts/{attemptId:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ChallengeAttemptDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAttempt(
        Guid attemptId,
        CancellationToken cancellationToken)
    {
        var query = new GetChallengeAttemptQuery(attemptId);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<ChallengeAttemptDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Submit or update an answer for a question
    /// </summary>
    [HttpPost("attempts/{attemptId:guid}/answers")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ChallengeAnswerDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitAnswer(
        Guid attemptId,
        [FromBody] SubmitAnswerRequest request,
        CancellationToken cancellationToken)
    {
        var command = new SubmitAnswerCommand(
            attemptId,
            request.QuestionId,
            request.SelectedOptionIndexes,
            request.MatchingPairs,
            request.OrderingItems);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<ChallengeAnswerDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Flag or unflag a question
    /// </summary>
    [HttpPut("attempts/{attemptId:guid}/questions/{questionId:guid}/flag")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> FlagQuestion(
        Guid attemptId,
        Guid questionId,
        [FromBody] FlagQuestionRequest request,
        CancellationToken cancellationToken)
    {
        var command = new FlagQuestionCommand(
            attemptId,
            questionId,
            request.IsFlagged);

        await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = request.IsFlagged ? "Đã đánh dấu câu hỏi" : "Đã bỏ đánh dấu câu hỏi"
        });
    }

    /// <summary>
    /// Navigate to a specific question
    /// </summary>
    [HttpPut("attempts/{attemptId:guid}/navigate")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> NavigateQuestion(
        Guid attemptId,
        [FromBody] NavigateQuestionRequest request,
        CancellationToken cancellationToken)
    {
        var command = new NavigateQuestionCommand(
            attemptId,
            request.QuestionIndex);

        await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Đã chuyển đến câu hỏi"
        });
    }

    /// <summary>
    /// Submit all answers for a challenge attempt at once
    /// </summary>
    [HttpPost("attempts/{attemptId:guid}/submit-answers")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ChallengeAttemptDto>), StatusCodes.Status200OK)]
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

        var command = new SubmitAnswersCommand(attemptId, answers);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<ChallengeAttemptDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Complete the challenge attempt
    /// </summary>
    [HttpPost("attempts/{attemptId:guid}/complete")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ChallengeAttemptDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CompleteAttempt(
        Guid attemptId,
        CancellationToken cancellationToken)
    {
        var command = new CompleteAttemptCommand(attemptId);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<ChallengeAttemptDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Get leaderboard for a challenge
    /// </summary>
    [HttpGet("{challengeId:guid}/leaderboard")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ChallengeLeaderboardDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaderboard(
        Guid challengeId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var query = new GetLeaderboardQuery(challengeId, page, pageSize);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<ChallengeLeaderboardDto>
        {
            Success = true,
            Data = result
        });
    }
}

// Request DTOs
public class StartChallengeAttemptRequest
{
    public string Nickname { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
}

public class SubmitAnswerRequest
{
    public Guid QuestionId { get; set; }
    public List<int>? SelectedOptionIndexes { get; set; }
    public List<AnswerMatchingPairDto>? MatchingPairs { get; set; }
    public List<AnswerOrderingItemDto>? OrderingItems { get; set; }
}

public class FlagQuestionRequest
{
    public bool IsFlagged { get; set; }
}

public class NavigateQuestionRequest
{
    public int QuestionIndex { get; set; }
}

public class SubmitAnswersRequest
{
    public List<AnswerSubmissionItemDto> Answers { get; set; } = new();
}

public class AnswerSubmissionItemDto
{
    public Guid QuestionId { get; set; }
    public List<int>? SelectedOptionIndexes { get; set; }
    public List<AnswerMatchingPairDto>? MatchingPairs { get; set; }
    public List<AnswerOrderingItemDto>? OrderingItems { get; set; }
}

