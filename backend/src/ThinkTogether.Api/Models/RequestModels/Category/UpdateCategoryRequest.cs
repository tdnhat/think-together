namespace ThinkTogether.Api.Models.RequestModels.Category;

public record UpdateCategoryRequest(
    string Name,
    string? Description = null,
    int DisplayOrder = 0,
    bool IsActive = true);
