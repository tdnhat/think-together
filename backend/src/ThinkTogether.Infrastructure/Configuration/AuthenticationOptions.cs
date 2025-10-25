using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Configuration;

public sealed class AuthenticationOptions
{
    public const string SectionName = "AuthenticationSettings";

    [Range(1, 24)]
    public int PasswordResetTokenLifetimeHours { get; set; } = 1;

    [Range(1, 168)] // 1 hour to 1 week
    public int EmailConfirmationTokenLifetimeHours { get; set; } = 24;

    [Range(16, 64)] // 16 to 64 bytes for security
    public int TokenGenerationByteSize { get; set; } = 32;
}
