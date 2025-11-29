using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Infrastructure.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ThinkTogether.Application.Interfaces;

namespace ThinkTogether.Infrastructure.Services;

public sealed class CloudinaryService : IImageUploadService
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
        if (!allowedMimeTypes.Contains(file.ContentType?.ToLower()))
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
            // https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{ext}
            
            var uri = new Uri(url);
            var path = uri.AbsolutePath;
            
            // Extract the last segment and remove the extension
            var lastSegment = path.Split('/').LastOrDefault();
            if (string.IsNullOrEmpty(lastSegment))
                return null;

            // Remove file extension
            var publicId = Path.GetFileNameWithoutExtension(lastSegment);
            return string.IsNullOrEmpty(publicId) ? null : publicId;
        }
        catch
        {
            return null;
        }
    }
}
