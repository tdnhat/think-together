namespace ThinkTogether.Application.DTOs;

public class AuthTokenDto
{
    public string AccessToken { get; init; } = string.Empty;
    public string? RefreshToken { get; init; }
    public long ExpiresAt { get; init; }

    public AuthTokenDto WithoutRefreshToken()
    {
        return new AuthTokenDto
        {
            AccessToken = this.AccessToken,
            ExpiresAt = this.ExpiresAt
        };
    }
}