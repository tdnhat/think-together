using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Infrastructure.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Infrastructure.Services;

public sealed class CloudinaryService : IFileUploadService
{
    private readonly Cloudinary _cloudinary;
    private readonly CloudinaryOptions _options;
    private readonly ILogger<CloudinaryService> _logger;

    public CloudinaryService(
        IOptions<CloudinaryOptions> options,
        ILogger<CloudinaryService> logger)
    {
        _options = options.Value;
        _logger = logger;

        var account = new Account(
            _options.CloudName,
            _options.ApiKey,
            _options.ApiSecret);

        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(
        IFormFile file,
        string folder = "quiz-sets/covers",
        CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File không được trống", nameof(file));
        }

        // Validate file size (convert MB to bytes)
        var maxSizeBytes = _options.MaxFileSizeMb * 1024 * 1024;
        if (file.Length > maxSizeBytes)
        {
            throw new ArgumentException(
                $"Kích thước file không được vượt quá {_options.MaxFileSizeMb}MB",
                nameof(file));
        }

        // Validate file type
        var allowedMimeTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
        if (!allowedMimeTypes.Contains(file.ContentType.ToLower()))
        {
            throw new ArgumentException(
                "Chỉ hỗ trợ các định dạng ảnh: JPEG, PNG, WebP, GIF",
                nameof(file));
        }

        try
        {
            using var stream = file.OpenReadStream();
            
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,
                PublicId = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}",
                Overwrite = false
            };

            _logger.LogInformation("Uploading image {FileName} to Cloudinary folder {Folder}",
                file.FileName, folder);

            var uploadResult = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

            if (uploadResult.Error != null)
            {
                _logger.LogError("Cloudinary upload failed: {Error}",
                    uploadResult.Error.Message);
                throw new InvalidOperationException(
                    $"Tải ảnh lên thất bại: {uploadResult.Error.Message}");
            }

            _logger.LogInformation("Image uploaded successfully: {PublicId}",
                uploadResult.PublicId);

            return uploadResult.SecureUrl.ToString();
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Image upload was cancelled for file {FileName}",
                file.FileName);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error uploading image {FileName}",
                file.FileName);
            throw new InvalidOperationException(
                "Tải ảnh lên thất bại", ex);
        }
    }

    public async Task DeleteImageAsync(
        string imageUrl,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            throw new ArgumentException("URL ảnh không được trống", nameof(imageUrl));
        }

        try
        {
            // Extract public ID from URL
            var publicId = ExtractPublicIdFromUrl(imageUrl);
            if (string.IsNullOrEmpty(publicId))
            {
                _logger.LogWarning("Could not extract public ID from URL: {ImageUrl}",
                    imageUrl);
                return;
            }

            var deleteParams = new DeletionParams(publicId);

            _logger.LogInformation("Deleting image with public ID: {PublicId}", publicId);

            var deleteResult = await _cloudinary.DestroyAsync(deleteParams);

            if (deleteResult.Error != null)
            {
                _logger.LogWarning("Cloudinary deletion warning: {Error}",
                    deleteResult.Error.Message);
            }
            else
            {
                _logger.LogInformation("Image deleted successfully: {PublicId}", publicId);
            }
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Image deletion was cancelled for URL: {ImageUrl}",
                imageUrl);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error deleting image from URL: {ImageUrl}",
                imageUrl);
            // Don't throw - deletion failure shouldn't break the application
        }
    }

    private static string? ExtractPublicIdFromUrl(string url)
    {
        try
        {
            // Cloudinary URLs typically look like:
            // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{ext}
            // OR
            // https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/{folder}/{public_id}.{ext}
            
            var uri = new Uri(url);
            var path = uri.AbsolutePath;
            
            // Split the path and find the 'upload' segment
            var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var uploadIndex = Array.FindIndex(segments, s => s.Equals("upload", StringComparison.OrdinalIgnoreCase));
            
            if (uploadIndex == -1 || uploadIndex == segments.Length - 1)
                return null;
            
            // Get all segments after 'upload', skipping version if present
            var startIndex = uploadIndex + 1;
            if (segments[startIndex].StartsWith("v", StringComparison.OrdinalIgnoreCase) && 
                segments[startIndex].Length > 1 && 
                char.IsDigit(segments[startIndex][1]))
            {
                startIndex++; // Skip version number
            }
            
            if (startIndex >= segments.Length)
                return null;
            
            // Join remaining segments to form the public ID (folder/filename)
            var publicIdSegments = segments[startIndex..];
            var fullPath = string.Join("/", publicIdSegments);
            
            // Remove file extension from the last segment
            var lastDotIndex = fullPath.LastIndexOf('.');
            if (lastDotIndex > 0)
            {
                fullPath = fullPath[..lastDotIndex];
            }
            
            return string.IsNullOrEmpty(fullPath) ? null : fullPath;
        }
        catch
        {
            return null;
        }
    }

    public async Task<string> UploadAudioAsync(
        IFormFile file,
        string folder = "quiz-sets/audio",
        CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File không được trống", nameof(file));
        }

        // Validate file size
        var maxSizeBytes = _options.MaxFileSizeMb * 1024 * 1024;
        if (file.Length > maxSizeBytes)
        {
            throw new ArgumentException(
                $"Kích thước file không được vượt quá {_options.MaxFileSizeMb}MB",
                nameof(file));
        }

        // Validate file type for audio
        var allowedMimeTypes = new[] { "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/flac", "audio/webm" };
        if (!allowedMimeTypes.Contains(file.ContentType.ToLower()))
        {
            throw new ArgumentException(
                "Chỉ hỗ trợ các định dạng âm thanh: MP3, WAV, OGG, M4A, FLAC, WebM",
                nameof(file));
        }

        try
        {
            using var stream = file.OpenReadStream();

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,
                PublicId = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}",
                Overwrite = false
            };

            _logger.LogInformation("Uploading audio {FileName} to Cloudinary folder {Folder}",
                file.FileName, folder);

            var uploadResult = await _cloudinary.UploadLargeAsync(uploadParams, 20971520, cancellationToken);

            if (uploadResult.Error != null)
            {
                _logger.LogError("Cloudinary audio upload failed: {Error}",
                    uploadResult.Error.Message);
                throw new InvalidOperationException(
                    $"Tải âm thanh lên thất bại: {uploadResult.Error.Message}");
            }

            _logger.LogInformation("Audio uploaded successfully: {PublicId}",
                uploadResult.PublicId);

            return uploadResult.SecureUrl.ToString();
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Audio upload was cancelled for file {FileName}",
                file.FileName);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error uploading audio {FileName}",
                file.FileName);
            throw new InvalidOperationException(
                "Tải âm thanh lên thất bại", ex);
        }
    }

    public async Task DeleteAudioAsync(
        string audioUrl,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(audioUrl))
        {
            throw new ArgumentException("URL âm thanh không được trống", nameof(audioUrl));
        }

        try
        {
            // Extract public ID from URL
            var publicId = ExtractPublicIdFromUrl(audioUrl);
            if (string.IsNullOrEmpty(publicId))
            {
                _logger.LogWarning("Could not extract public ID from URL: {AudioUrl}",
                    audioUrl);
                return;
            }

            var deleteParams = new DeletionParams(publicId) { ResourceType = ResourceType.Auto };

            _logger.LogInformation("Deleting audio with public ID: {PublicId}", publicId);

            var deleteResult = await _cloudinary.DestroyAsync(deleteParams);

            if (deleteResult.Error != null)
            {
                _logger.LogWarning("Cloudinary audio deletion warning: {Error}",
                    deleteResult.Error.Message);
            }
            else
            {
                _logger.LogInformation("Audio deleted successfully: {PublicId}", publicId);
            }
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Audio deletion was cancelled for URL: {AudioUrl}",
                audioUrl);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error deleting audio from URL: {AudioUrl}",
                audioUrl);
            // Don't throw - deletion failure shouldn't break the application
        }
    }

    public async Task<string> UploadVideoAsync(
        IFormFile file,
        string folder = "quiz-sets/video",
        CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File không được trống", nameof(file));
        }

        // Validate file size (videos can be larger, so we use a multiplier)
        var maxSizeBytes = _options.MaxFileSizeMb * 1024 * 1024 * 5; // 5x theregular limit for videos
        if (file.Length > maxSizeBytes)
        {
            throw new ArgumentException(
                $"Kích thước file không được vượt quá {_options.MaxFileSizeMb * 5}MB",
                nameof(file));
        }

        // Validate file type for video
        var allowedMimeTypes = new[] { "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo" };
        if (!allowedMimeTypes.Contains(file.ContentType.ToLower()))
        {
            throw new ArgumentException(
                "Chỉ hỗ trợ các định dạng video: MP4, WebM, OGG, MOV, AVI",
                nameof(file));
        }

        try
        {
            using var stream = file.OpenReadStream();

            var uploadParams = new VideoUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,
                PublicId = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}",
                Overwrite = false
            };

            _logger.LogInformation("Uploading video {FileName} to Cloudinary folder {Folder}",
                file.FileName, folder);

            var uploadResult = await _cloudinary.UploadLargeAsync(uploadParams, 20971520, cancellationToken);

            if (uploadResult.Error != null)
            {
                _logger.LogError("Cloudinary video upload failed: {Error}",
                    uploadResult.Error.Message);
                throw new InvalidOperationException(
                    $"Tải video lên thất bại: {uploadResult.Error.Message}");
            }

            _logger.LogInformation("Video uploaded successfully: {PublicId}",
                uploadResult.PublicId);

            return uploadResult.SecureUrl.ToString();
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Video upload was cancelled for file {FileName}",
                file.FileName);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error uploading video {FileName}",
                file.FileName);
            throw new InvalidOperationException(
                "Tải video lên thất bại", ex);
        }
    }

    public async Task DeleteVideoAsync(
        string videoUrl,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(videoUrl))
        {
            throw new ArgumentException("URL video không được trống", nameof(videoUrl));
        }

        try
        {
            // Extract public ID from URL
            var publicId = ExtractPublicIdFromUrl(videoUrl);
            if (string.IsNullOrEmpty(publicId))
            {
                _logger.LogWarning("Could not extract public ID from URL: {VideoUrl}",
                    videoUrl);
                return;
            }

            var deleteParams = new DeletionParams(publicId) { ResourceType = ResourceType.Video };

            _logger.LogInformation("Deleting video with public ID: {PublicId}", publicId);

            var deleteResult = await _cloudinary.DestroyAsync(deleteParams);

            if (deleteResult.Error != null)
            {
                _logger.LogWarning("Cloudinary video deletion warning: {Error}",
                    deleteResult.Error.Message);
            }
            else
            {
                _logger.LogInformation("Video deleted successfully: {PublicId}", publicId);
            }
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogWarning(ex, "Video deletion was cancelled for URL: {VideoUrl}",
                videoUrl);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error deleting video from URL: {VideoUrl}",
                videoUrl);
            // Don't throw - deletion failure shouldn't break the application
        }
    }
}
