using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models.ResponseModels.Category;
using ThinkTogether.Application.Handlers.Category.Queries.GetAllCategories;
using ThinkTogether.Application.Handlers.Category.Queries.GetCategoryById;
using ThinkTogether.Application.Handlers.Category.Queries.SearchCategories;

namespace ThinkTogether.Api.Controllers.Category;

public partial class CategoryController
{
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<CategoryResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] bool onlyActive = true,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAllCategoriesQuery { OnlyActive = onlyActive };
        var result = await _mediator.Send(query, cancellationToken);
        
        return Ok(result.Select(CategoryResponse.FromDto));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(CategoryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetCategoryByIdQuery { Id = id };
        var result = await _mediator.Send(query, cancellationToken);
        
        return Ok(CategoryResponse.FromDto(result));
    }

    [HttpGet("search")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<CategoryResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search(
        [FromQuery] string searchTerm,
        CancellationToken cancellationToken = default)
    {
        var query = new SearchCategoriesQuery { SearchTerm = searchTerm };
        var result = await _mediator.Send(query, cancellationToken);
        
        return Ok(result.Select(CategoryResponse.FromDto));
    }
}
