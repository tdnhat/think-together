using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Challenge.Commands.CreateChallenge;
using ThinkTogether.Application.Handlers.Challenge.Commands.StartChallengeAttempt;
using ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswers;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeAttempt;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByQuizSetId;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeByShareLink;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetLeaderboard;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeStats;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

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
            request.UserId,
            request.HomeworkId);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<ChallengeAttemptDto>
        {
            Success = true,
            Data = result
        });
    }

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

        var command = new SubmitAnswersCommand(attemptId, answers, request.HomeworkId);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(new ApiResponse<ChallengeAttemptDto>
        {
            Success = true,
            Message = "Đã nộp bài và chấm điểm thành công",
            Data = result
        });
    }

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

    [HttpGet("{challengeId:guid}/stats")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ChallengeStatsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChallengeStats(
        Guid challengeId,
        CancellationToken cancellationToken = default)
    {
        var query = new GetChallengeStatsQuery(challengeId);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<ChallengeStatsDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpGet("attempts/{attemptId:guid}/export/pdf")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportAttemptPdf(
        Guid attemptId,
        CancellationToken cancellationToken)
    {
        var query = new GetChallengeAttemptQuery(attemptId);
        var attemptDto = await _mediator.Send(query, cancellationToken);

        var challengeQuery = new GetChallengeByAttemptIdQuery(attemptId);
        var challenge = await _mediator.Send(challengeQuery, cancellationToken);

        var quizSetRepository = HttpContext.RequestServices.GetRequiredService<IQuizSetRepository>();
        var quizSet = await quizSetRepository.GetByIdAsync(challenge.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", challenge.QuizSetId);

        var pdfExportService = HttpContext.RequestServices.GetRequiredService<IPdfExportService>();
        var pdfData = await pdfExportService.ExportAttemptReportAsync(
            attemptDto,
            challenge.Title,
            quizSet.Title,
            cancellationToken);

        var fileName = $"ket-qua-{attemptDto.Nickname.Replace(" ", "-")}-{DateTime.Now:yyyyMMdd-HHmmss}.pdf";
        return File(pdfData, "application/pdf", fileName);
    }

    [HttpGet("{challengeId:guid}/leaderboard/export/pdf")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportLeaderboardPdf(
        Guid challengeId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var leaderboardQuery = new GetLeaderboardQuery(challengeId, page, pageSize);
        var leaderboardDto = await _mediator.Send(leaderboardQuery, cancellationToken);

        var challengeRepository = HttpContext.RequestServices.GetRequiredService<IChallengeRepository>();
        var challenge = await challengeRepository.GetByIdAsync(challengeId, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", challengeId);

        var pdfExportService = HttpContext.RequestServices.GetRequiredService<IPdfExportService>();
        var pdfData = await pdfExportService.ExportLeaderboardAsync(
            leaderboardDto,
            challenge.Title,
            cancellationToken);

        var fileName = $"bang-xep-hang-{challenge.Title.Replace(" ", "-")}-{DateTime.Now:yyyyMMdd-HHmmss}.pdf";
        return File(pdfData, "application/pdf", fileName);
    }

    [HttpGet("{challengeId:guid}/stats/export/pdf")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportStatisticsPdf(
        Guid challengeId,
        CancellationToken cancellationToken = default)
    {
        var statsQuery = new GetChallengeStatsQuery(challengeId);
        var statsDto = await _mediator.Send(statsQuery, cancellationToken);

        var challengeRepository = HttpContext.RequestServices.GetRequiredService<IChallengeRepository>();
        var challenge = await challengeRepository.GetByIdAsync(challengeId, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", challengeId);

        var pdfExportService = HttpContext.RequestServices.GetRequiredService<IPdfExportService>();
        var pdfData = await pdfExportService.ExportStatisticsAsync(
            statsDto,
            challenge.Title,
            cancellationToken);

        var fileName = $"thong-ke-{challenge.Title.Replace(" ", "-")}-{DateTime.Now:yyyyMMdd-HHmmss}.pdf";
        return File(pdfData, "application/pdf", fileName);
    }
}

// Request DTOs
public class StartChallengeAttemptRequest
{
    public string Nickname { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public Guid? HomeworkId { get; set; }
}

public class SubmitAnswersRequest
{
    public List<AnswerSubmissionItemDto> Answers { get; set; } = new();
    public Guid? HomeworkId { get; set; }
}

public class AnswerSubmissionItemDto
{
    public Guid QuestionId { get; set; }
    public List<int>? SelectedOptionIndexes { get; set; }
    public List<AnswerMatchingPairDto>? MatchingPairs { get; set; }
    public List<AnswerOrderingItemDto>? OrderingItems { get; set; }
}
