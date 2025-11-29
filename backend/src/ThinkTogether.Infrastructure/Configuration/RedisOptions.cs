using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Configuration;

public sealed class RedisOptions
{
    public const string SectionName = "RedisSettings";

    [Required]
    public string ConnectionString { get; set; } = string.Empty;

    [Range(0, 15)]
    public int Database { get; set; } = 0;

    public string InstanceName { get; set; } = "ThinkTogether:";
}

