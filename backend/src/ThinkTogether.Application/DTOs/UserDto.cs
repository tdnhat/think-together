namespace Application.DTOs;

public record UserDto(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string? AvatarUrl = null,
    string? Bio = null,
    DateTime? CreatedAt = null);
