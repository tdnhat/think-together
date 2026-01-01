namespace ThinkTogether.Api.Models.RequestModels.Category;

public record CreateCategoryRequest(
    string Name,
    string? Description = null,
    int DisplayOrder = 0);
