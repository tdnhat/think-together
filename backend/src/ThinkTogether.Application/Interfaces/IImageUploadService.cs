using Microsoft.AspNetCore.Http;

namespace ThinkTogether.Application.Interfaces;

public interface IImageUploadService
{
    Task<string> UploadImageAsync(
        IFormFile file,
        string folder = "quiz-sets/covers",
        CancellationToken cancellationToken = default);

    Task DeleteImageAsync(string imageUrl, CancellationToken cancellationToken = default);

    Task<string> UploadAudioAsync(
        IFormFile file,
        string folder = "quiz-sets/audio",
        CancellationToken cancellationToken = default);

    Task DeleteAudioAsync(string audioUrl, CancellationToken cancellationToken = default);
}
