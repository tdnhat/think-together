using Microsoft.AspNetCore.Http;

namespace ThinkTogether.Application.Interfaces;

/// <summary>
/// Service for uploading images to cloud storage
/// </summary>
public interface IImageUploadService
{
    /// <summary>
    /// Upload an image file to cloud storage
    /// </summary>
    /// <param name="file">The image file to upload</param>
    /// <param name="folder">The folder path in cloud storage</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The URL of the uploaded image</returns>
    Task<string> UploadImageAsync(
        IFormFile file,
        string folder = "quiz-sets/covers",
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Delete an image from cloud storage
    /// </summary>
    /// <param name="imageUrl">The URL of the image to delete</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task DeleteImageAsync(string imageUrl, CancellationToken cancellationToken = default);
}
