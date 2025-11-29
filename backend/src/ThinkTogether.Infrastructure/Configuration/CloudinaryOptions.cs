using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Configuration;

public sealed class CloudinaryOptions
{
    public const string SectionName = "Cloudinary";
    
    [Required(ErrorMessage = "Cloudinary Cloud Name không được trống")]
    public string CloudName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Cloudinary API Key không được trống")]
    public string ApiKey { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Cloudinary API Secret không được trống")]
    public string ApiSecret { get; set; } = string.Empty;
    
    public string UploadFolder { get; set; } = "quiz-sets/covers";
    
    public int MaxFileSizeMb { get; set; } = 5;
}
