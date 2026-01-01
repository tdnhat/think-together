using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetAllQuizSets;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetPublicQuizzes;
using ThinkTogether.Application.Handlers.QuizSet.Queries.GetQuizSetById;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Api.Controllers.QuizSet;

public partial class QuizSetController
{
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponse<QuizSetDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllQuizSets(
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] string? filterBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetAllQuizSetsQuery
        {
            Search = search,
            SortBy = sortBy,
            FilterBy = filterBy,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    [HttpGet("public")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PaginatedResponse<QuizSetDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublicQuizzes(
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetPublicQuizzesQuery
        {
            Search = search,
            SortBy = sortBy,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(QuizSetDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetQuizSetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetQuizSetByIdQuery(id), cancellationToken);

        return Ok(result
        );
    }
}
