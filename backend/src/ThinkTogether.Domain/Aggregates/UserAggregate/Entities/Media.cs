using Shared.Primitives;

namespace Domain.Aggregates.UserAggregate.Entities;

public sealed class Media : Entity
{
    // Private constructor for EF Core
    private Media()
    {
    }

    public Guid Id { get; private set; }

    public Guid UploadedById { get; private set; }

    public string Filename { get; private set; } = string.Empty;

    public string Url { get; private set; } = string.Empty;

    public MediaType Type { get; private set; }

    public string MimeType { get; private set; } = string.Empty;

    public int FileSizeBytes { get; private set; }

    public int? DurationSeconds { get; private set; } // For videos

    public static Media Create(
        Guid uploadedById,
        string filename,
        string url,
        MediaType type,
        string mimeType,
        int fileSizeBytes,
        int? durationSeconds = null)
    {
        if (string.IsNullOrWhiteSpace(filename))
            throw new Domain.Exceptions.ValidationException("Tên file là bắt buộc");

        if (string.IsNullOrWhiteSpace(url))
            throw new Domain.Exceptions.ValidationException("URL là bắt buộc");

        if (string.IsNullOrWhiteSpace(mimeType))
            throw new Domain.Exceptions.ValidationException("Loại MIME là bắt buộc");

        if (fileSizeBytes <= 0)
            throw new Domain.Exceptions.ValidationException("Kích thước file phải lớn hơn 0");

        if (durationSeconds.HasValue && durationSeconds.Value <= 0)
            throw new Domain.Exceptions.ValidationException("Thời lượng video phải lớn hơn 0");

        return new Media
        {
            UploadedById = uploadedById,
            Filename = filename.Trim(),
            Url = url.Trim(),
            Type = type,
            MimeType = mimeType.Trim(),
            FileSizeBytes = fileSizeBytes,
            DurationSeconds = durationSeconds,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}

public enum MediaType
{
    IMAGE,
    VIDEO
}
