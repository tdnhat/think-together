using Microsoft.AspNetCore.Http;

namespace ThinkTogether.Application.Interfaces;

public interface IFileUploadService
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

    Task<string> UploadVideoAsync(
        IFormFile file,
        string folder = "quiz-sets/video",
        CancellationToken cancellationToken = default);

    Task DeleteVideoAsync(string videoUrl, CancellationToken cancellationToken = default);
}
