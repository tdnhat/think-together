using Domain.Aggregates.QuizAggregate.Entities;
using Shared.Primitives;

namespace Domain.Aggregates.QuizAggregate;

public sealed class QuizSet : AggregateRoot
{
    private readonly List<Question> _questions = new();

    private QuizSet()
    {
    }

    public Guid Id { get; private set; }

    public Guid CreatorId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public string? CoverImageUrl { get; private set; }

    public bool IsPublished { get; private set; }

    public int DisplayOrder { get; private set; }

    public IReadOnlyList<Question> Questions => _questions.AsReadOnly();

    public static QuizSet Create(Guid creatorId, string title, string? description = null)
    {
        if (creatorId == Guid.Empty)
            throw new ArgumentException("Creator ID cannot be empty", nameof(creatorId));

        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty", nameof(title));

        if (title.Length > 255)
            throw new ArgumentException("Title cannot exceed 255 characters", nameof(title));

        return new QuizSet
        {
            Id = Guid.NewGuid(),
            CreatorId = creatorId,
            Title = title.Trim(),
            Description = description?.Trim(),
            IsPublished = false,
            DisplayOrder = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void AddQuestion(Question question)
    {
        if (question == null)
            throw new ArgumentNullException(nameof(question));

        if (_questions.Count >= 100)
            throw new InvalidOperationException("Cannot exceed 100 questions per quiz set");

        _questions.Add(question);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveQuestion(Guid questionId)
    {
        var question = _questions.FirstOrDefault(q => q.Id == questionId);
        if (question != null)
        {
            _questions.Remove(question);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void UpdateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty", nameof(title));

        if (title.Length > 255)
            throw new ArgumentException("Title cannot exceed 255 characters", nameof(title));

        Title = title.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDescription(string? description)
    {
        Description = description?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateCoverImageUrl(string? imageUrl)
    {
        if (imageUrl != null && imageUrl.Length > 500)
            throw new ArgumentException("Image URL cannot exceed 500 characters", nameof(imageUrl));

        CoverImageUrl = imageUrl?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDisplayOrder(int order)
    {
        if (order < 0)
            throw new ArgumentException("Display order cannot be negative", nameof(order));

        DisplayOrder = order;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Publish()
    {
        if (_questions.Count == 0)
            throw new InvalidOperationException("Cannot publish quiz set without questions");

        IsPublished = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Unpublish()
    {
        IsPublished = false;
        UpdatedAt = DateTime.UtcNow;
    }
}

