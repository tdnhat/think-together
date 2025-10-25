using System.ComponentModel.DataAnnotations;

namespace ThinkTogether.Application.Configuration;

public class ApplicationOptions
{
    public const string SectionName = "ApplicationSettings";

    [Required]
    public string FrontendBaseUrl { get; set; } = string.Empty;
}
