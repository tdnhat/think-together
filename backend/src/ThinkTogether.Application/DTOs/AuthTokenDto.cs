namespace Application.DTOs;

public record AuthTokenDto(
    string AccessToken,
    string RefreshToken,
    long ExpiresAt,
    string TokenType = "Bearer");
