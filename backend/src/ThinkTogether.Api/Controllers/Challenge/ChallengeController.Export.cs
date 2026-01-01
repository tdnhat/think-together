using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeAttempt;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetChallengeStats;
using ThinkTogether.Application.Handlers.Challenge.Queries.GetLeaderboard;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Api.Controllers.Challenge;

public partial class ChallengeController
{
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
