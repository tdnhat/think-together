using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Configuration;

public sealed class JwtOptions
{
    public const string SectionName = "JwtSettings";

    [Required]
    [MinLength(32)]
    public string Secret { get; set; } = string.Empty;

    [Required]
    public string Issuer { get; set; } = string.Empty;

    [Required]
    public string Audience { get; set; } = string.Empty;

    [Range(1, 1440)]
    public int AccessTokenExpirationMinutes { get; set; } = 15;

    [Range(1, 90)]
    public int RefreshTokenExpirationDays { get; set; } = 7;

    [Range(1, 365)]
    public int RefreshTokenExpirationDaysRememberMe { get; set; } = 30;
}
