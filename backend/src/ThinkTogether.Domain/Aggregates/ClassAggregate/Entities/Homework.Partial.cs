using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;

public sealed partial class Homework
{
    public void AddSubmission(HomeworkSubmission submission)
    {
        if (submission == null)
            throw new ValidationException("Bài nộp không được null");

        _submissions.Add(submission);
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Tiêu đề không được trống");

        if (title.Length > 255)
            throw new ValidationException("Tiêu đề không được vượt quá 255 ký tự");

        Title = title.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDueDate(DateTime? dueDate)
    {
        if (dueDate.HasValue && dueDate <= DateTime.UtcNow)
            throw new ValidationException("Ngày hết hạn phải ở tương lai");

        DueDate = dueDate;
        UpdatedAt = DateTime.UtcNow;
    }
}
