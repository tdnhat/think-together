using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Api.Models.ResponseModels.Category;

public record CategoryResponse(
    Guid Id,
    string Name,
    string? Description,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt)
{
    public static CategoryResponse FromDto(CategoryDto dto) => new(
        dto.Id,
        dto.Name,
        dto.Description,
        dto.IsActive,
        dto.CreatedAt,
        dto.UpdatedAt);
}
