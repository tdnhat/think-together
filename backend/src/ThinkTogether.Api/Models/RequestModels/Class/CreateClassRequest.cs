namespace ThinkTogether.Api.Models.RequestModels.Class;

public record CreateClassRequest(
    string Name,
    string? Description = null,
    string? CoverImageUrl = null);
