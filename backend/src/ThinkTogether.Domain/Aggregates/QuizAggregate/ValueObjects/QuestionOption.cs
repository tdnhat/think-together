namespace Domain.Aggregates.QuizAggregate.ValueObjects;

public record QuestionOption
{
    public string Content { get; init; } = string.Empty;

    public bool IsCorrect { get; init; }

    public string? ImageUrl { get; init; }

    public int DisplayOrder { get; init; }

    private QuestionOption()
    {
    }

    public static QuestionOption Create(
        string content,
        bool isCorrect,
        string? imageUrl = null,
        int displayOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Content cannot be empty", nameof(content));

        if (content.Length > 1000)
            throw new ArgumentException("Content cannot exceed 1000 characters", nameof(content));

        if (imageUrl != null && imageUrl.Length > 500)
            throw new ArgumentException("Image URL cannot exceed 500 characters", nameof(imageUrl));

        if (displayOrder < 0)
            throw new ArgumentException("Display order cannot be negative", nameof(displayOrder));

        return new QuestionOption
        {
            Content = content.Trim(),
            IsCorrect = isCorrect,
            ImageUrl = imageUrl?.Trim(),
            DisplayOrder = displayOrder
        };
    }
}

