using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.Leaderboard.Queries.GetLeaderboard;
using ThinkTogether.Application.Handlers.Leaderboard.Queries.GetLeaderboardStats;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Api.Controllers.Leaderboard;

[ApiController]
[Route("api/leaderboard")]
[Authorize]
public class LeaderboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public LeaderboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<LeaderboardDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaderboard(
        [FromQuery] Guid? quizSetId = null,
        [FromQuery] Guid? challengeId = null,
        [FromQuery] LeaderboardTimePeriod? timePeriod = null,
        [FromQuery] LeaderboardSortBy? sortBy = null,
        [FromQuery] string? sortOrder = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool? isHomework = null,
        [FromQuery] Guid? classId = null,
        [FromQuery] Guid? homeworkId = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetLeaderboardQuery(
            QuizSetId: quizSetId,
            ChallengeId: challengeId,
            TimePeriod: timePeriod,
            SortBy: sortBy,
            SortOrder: sortOrder,
            Page: page,
            PageSize: pageSize,
            IsHomework: isHomework,
            ClassId: classId,
            HomeworkId: homeworkId);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<LeaderboardDto>
        {
            Success = true,
            Data = result
        });
    }

    [HttpGet("stats")]
    [ProducesResponseType(typeof(ApiResponse<LeaderboardStatsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaderboardStats(
        [FromQuery] Guid? quizSetId = null,
        [FromQuery] Guid? challengeId = null,
        [FromQuery] LeaderboardTimePeriod? timePeriod = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetLeaderboardStatsQuery(
            QuizSetId: quizSetId,
            ChallengeId: challengeId,
            TimePeriod: timePeriod);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(new ApiResponse<LeaderboardStatsDto>
        {
            Success = true,
            Data = result
        });
    }
}
