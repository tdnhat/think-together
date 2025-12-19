using MediatR;

namespace ThinkTogether.Application.Handlers.Category.Commands.DeleteCategory;

public class DeleteCategoryCommand : IRequest
{
    public Guid Id { get; set; }
}

