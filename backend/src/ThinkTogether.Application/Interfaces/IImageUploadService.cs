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

    /// <summary>
    /// Upload an audio file to cloud storage
    /// </summary>
    /// <param name="file">The audio file to upload</param>
    /// <param name="folder">The folder path in cloud storage</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The URL of the uploaded audio</returns>
    Task<string> UploadAudioAsync(
        IFormFile file,
        string folder = "quiz-sets/audio",
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete an audio from cloud storage
    /// </summary>
    /// <param name="audioUrl">The URL of the audio to delete</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task DeleteAudioAsync(string audioUrl, CancellationToken cancellationToken = default);
}
