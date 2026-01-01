using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThinkTogether.Api.Models.RequestModels.Category;
using ThinkTogether.Api.Models.ResponseModels.Category;
using ThinkTogether.Application.Handlers.Category.Commands.CreateCategory;
using ThinkTogether.Application.Handlers.Category.Commands.DeleteCategory;
using ThinkTogether.Application.Handlers.Category.Commands.UpdateCategory;

namespace ThinkTogether.Api.Controllers.Category;

public partial class CategoryController
{
    [HttpPost]
    [Authorize(Roles = "Administrator")]
    [ProducesResponseType(typeof(CategoryResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateCategoryRequest request,
        CancellationToken cancellationToken = default)
    {
        var command = new CreateCategoryCommand
        {
            Name = request.Name,
            Description = request.Description,
            DisplayOrder = request.DisplayOrder
        };

        var result = await _mediator.Send(command, cancellationToken);
        
        return CreatedAtAction(
            nameof(GetById), 
            new { id = result.Id }, 
            CategoryResponse.FromDto(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Administrator")]
    [ProducesResponseType(typeof(CategoryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateCategoryRequest request,
        CancellationToken cancellationToken = default)
    {
        var command = new UpdateCategoryCommand
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive
        };

        var result = await _mediator.Send(command, cancellationToken);
        
        return Ok(CategoryResponse.FromDto(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Administrator")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var command = new DeleteCategoryCommand { Id = id };
        await _mediator.Send(command, cancellationToken);
        
        return NoContent();
    }
}
