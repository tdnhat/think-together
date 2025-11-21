using Domain.Aggregates.QuizAggregate.ValueObjects;
using Shared.Primitives;

namespace Domain.Aggregates.QuizAggregate.Entities;

public enum QuestionType
{
    SingleChoice,
    TrueFalse,
    MultipleChoice,
    Matching,
    Ordering,
    Video
}

public sealed class Question : Entity
{
    private readonly List<QuestionOption> _options = new();

    private Question()
    {
    }

    public Guid Id { get; private set; }

    public Guid QuizSetId { get; private set; }

    public string Content { get; private set; } = string.Empty;

    public QuestionType Type { get; private set; }

    public int TimeLimit { get; private set; }

    public int DisplayOrder { get; private set; }

    public IReadOnlyList<QuestionOption> Options => _options.AsReadOnly();

    public static Question Create(
        Guid quizSetId,
        string content,
        QuestionType type,
        int timeLimit,
        int displayOrder = 0)
    {
        if (quizSetId == Guid.Empty)
            throw new ArgumentException("Quiz set ID cannot be empty", nameof(quizSetId));

        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Content cannot be empty", nameof(content));

        if (content.Length > 2000)
            throw new ArgumentException("Content cannot exceed 2000 characters", nameof(content));

        if (timeLimit <= 0 || timeLimit > 300)
            throw new ArgumentException("Time limit must be between 1 and 300 seconds", nameof(timeLimit));

        if (displayOrder < 0)
            throw new ArgumentException("Display order cannot be negative", nameof(displayOrder));

        return new Question
        {
            Id = Guid.NewGuid(),
            QuizSetId = quizSetId,
            Content = content.Trim(),
            Type = type,
            TimeLimit = timeLimit,
            DisplayOrder = displayOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void AddOption(QuestionOption option)
    {
        if (option == null)
            throw new ArgumentNullException(nameof(option));

        if (_options.Count >= 10)
            throw new InvalidOperationException("Cannot exceed 10 options per question");

        _options.Add(option);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveOption(int index)
    {
        if (index < 0 || index >= _options.Count)
            throw new ArgumentOutOfRangeException(nameof(index));

        _options.RemoveAt(index);
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetOptions(List<QuestionOption> options)
    {
        if (options == null)
            throw new ArgumentNullException(nameof(options));

        if (options.Count == 0)
            throw new ArgumentException("At least one option is required", nameof(options));

        if (options.Count > 10)
            throw new ArgumentException("Cannot exceed 10 options per question", nameof(options));

        _options.Clear();
        _options.AddRange(options);
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateContent(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Content cannot be empty", nameof(content));

        if (content.Length > 2000)
            throw new ArgumentException("Content cannot exceed 2000 characters", nameof(content));

        Content = content.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateTimeLimit(int timeLimit)
    {
        if (timeLimit <= 0 || timeLimit > 300)
            throw new ArgumentException("Time limit must be between 1 and 300 seconds", nameof(timeLimit));

        TimeLimit = timeLimit;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDisplayOrder(int order)
    {
        if (order < 0)
            throw new ArgumentException("Display order cannot be negative", nameof(order));

        DisplayOrder = order;
        UpdatedAt = DateTime.UtcNow;
    }
}

