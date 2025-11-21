using Shared.Primitives;

namespace Domain.Aggregates.ClassAggregate.Entities;

public sealed class Homework : Entity
{
    private readonly List<HomeworkSubmission> _submissions = new();

    private Homework()
    {
    }

    public Guid Id { get; private set; }

    public Guid ClassId { get; private set; }

    public Guid QuizSetId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public DateTime? DueDate { get; private set; }

    public DateTime AssignedAt { get; private set; }

    public IReadOnlyList<HomeworkSubmission> Submissions => _submissions.AsReadOnly();

    public static Homework Create(
        Guid classId,
        Guid quizSetId,
        string title,
        DateTime? dueDate = null)
    {
        if (classId == Guid.Empty)
            throw new ArgumentException("Class ID cannot be empty", nameof(classId));

        if (quizSetId == Guid.Empty)
            throw new ArgumentException("Quiz set ID cannot be empty", nameof(quizSetId));

        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty", nameof(title));

        if (title.Length > 255)
            throw new ArgumentException("Title cannot exceed 255 characters", nameof(title));

        if (dueDate.HasValue && dueDate <= DateTime.UtcNow)
            throw new ArgumentException("Due date must be in the future", nameof(dueDate));

        return new Homework
        {
            Id = Guid.NewGuid(),
            ClassId = classId,
            QuizSetId = quizSetId,
            Title = title.Trim(),
            DueDate = dueDate,
            AssignedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void AddSubmission(HomeworkSubmission submission)
    {
        if (submission == null)
            throw new ArgumentNullException(nameof(submission));

        _submissions.Add(submission);
        UpdatedAt = DateTime.UtcNow;
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

    public void UpdateDueDate(DateTime? dueDate)
    {
        if (dueDate.HasValue && dueDate <= DateTime.UtcNow)
            throw new ArgumentException("Due date must be in the future", nameof(dueDate));

        DueDate = dueDate;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsOverdue => DueDate.HasValue && DateTime.UtcNow > DueDate;
}

