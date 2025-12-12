using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate;

public sealed partial class QuizSet : AggregateRoot
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
            throw new ValidationException("ID người tạo không được trống");

        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Tiêu đề không được trống");

        if (title.Length > 255)
            throw new ValidationException("Tiêu đề không được vượt quá 255 ký tự");

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

    public Question GetQuestion(Guid questionId)
    {
        var question = _questions.FirstOrDefault(q => q.Id == questionId);
        if (question == null)
            throw new EntityNotFoundException(nameof(Question), questionId);

        return question;
    }
}
