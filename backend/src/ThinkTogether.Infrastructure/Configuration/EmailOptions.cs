using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Configuration;

public sealed class EmailOptions
{
    public const string SectionName = "EmailSettings";

    [Required]
    public string SmtpHost { get; set; } = string.Empty;

    [Range(1, 65535)]
    public int SmtpPort { get; set; } = 587;

    [Required]
    [EmailAddress]
    public string SenderEmail { get; set; } = string.Empty;

    public string SenderName { get; set; } = "ThinkTogether";

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public bool UseSsl { get; set; } = true;

    public bool UseStartTls { get; set; } = true;

    [Range(1, 300)]
    public int TimeoutSeconds { get; set; } = 30;
}
