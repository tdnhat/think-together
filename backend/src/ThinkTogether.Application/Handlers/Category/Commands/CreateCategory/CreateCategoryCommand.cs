using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Category.Commands.CreateCategory;

public record CreateCategoryCommand(
    string Name,
    string Description,
    bool IsActive
) : IRequest<CategoryDto>;
