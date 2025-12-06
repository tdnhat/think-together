using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;

public sealed partial class Homework : Entity
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
            throw new ValidationException("ID lớp không được trống");

        if (quizSetId == Guid.Empty)
            throw new ValidationException("ID bộ câu hỏi không được trống");

        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Tiêu đề không được trống");

        if (title.Length > 255)
            throw new ValidationException("Tiêu đề không được vượt quá 255 ký tự");

        if (dueDate.HasValue && dueDate <= DateTime.UtcNow)
            throw new ValidationException("Ngày hết hạn phải ở tương lai");

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

    public bool IsOverdue => DueDate.HasValue && DateTime.UtcNow > DueDate;
}
