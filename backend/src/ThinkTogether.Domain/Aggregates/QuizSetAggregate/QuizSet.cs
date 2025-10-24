using Domain.Aggregates.QuizSetAggregate.Entities;
using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.QuizSetAggregate;

public sealed class QuizSet : AggregateRoot
{
    private readonly List<Question> _questions = new();

    // Private constructor for EF Core
    private QuizSet()
    {
    }

    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public string? CoverImageUrl { get; private set; }

    public bool IsPublished { get; private set; }

    public int DisplayOrder { get; private set; }

    public IReadOnlyList<Question> Questions => _questions.AsReadOnly();

    public static QuizSet Create(
        Guid userId,
        string title,
        string? description = null,
        string? coverImageUrl = null,
        int displayOrder = 0)
    {
        ValidateTitle(title);
        ValidateDescription(description);
        ValidateCoverImageUrl(coverImageUrl);

        var quizSet = new QuizSet
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title.Trim(),
            Description = description?.Trim(),
            CoverImageUrl = coverImageUrl?.Trim(),
            IsPublished = false,
            DisplayOrder = displayOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return quizSet;
    }


    public void AddQuestion(Question question)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể thêm câu hỏi vào bộ trắc nghiệm đã bị xóa");

        if (question == null)
            throw new ArgumentNullException(nameof(question));

        if (_questions.Count >= 100)
            throw new ValidationException("Bộ trắc nghiệm không được có quá 100 câu hỏi");

        if (_questions.Any(q => q.Id == question.Id))
        throw new ConflictException($"Câu hỏi với ID {question.Id} đã tồn tại trong bộ trắc nghiệm này");

        _questions.Add(question);
    }

    public void RemoveQuestion(Guid questionId)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể xóa câu hỏi khỏi bộ trắc nghiệm đã bị xóa");

        var question = _questions.FirstOrDefault(q => q.Id == questionId);
        if (question == null)
            throw new EntityNotFoundException(nameof(Question), questionId);

        _questions.Remove(question);
    }

    public void ReorderQuestions(Dictionary<Guid, int> questionOrderMap)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể sắp xếp lại câu hỏi trong bộ trắc nghiệm đã bị xóa");

        if (questionOrderMap == null || questionOrderMap.Count == 0)
            throw new ArgumentException("Bản đồ thứ tự câu hỏi không được rỗng", nameof(questionOrderMap));

        foreach (var kvp in questionOrderMap)
        {
            var question = _questions.FirstOrDefault(q => q.Id == kvp.Key);
            if (question == null)
                throw new EntityNotFoundException(nameof(Question), kvp.Key);
        }
    }

    public void UpdateMetadata(string title, string? description = null, string? coverImageUrl = null)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể cập nhật bộ trắc nghiệm đã bị xóa");

        ValidateTitle(title);
        ValidateDescription(description);
        ValidateCoverImageUrl(coverImageUrl);

        Title = title.Trim();
        Description = description?.Trim();
        CoverImageUrl = coverImageUrl?.Trim();
    }

    public void Publish()
    {
        if (IsDeleted)
            throw new ValidationException("Không thể đăng tải bộ trắc nghiệm đã bị xóa");

        if (IsPublished)
            return; // Already published

        if (_questions.Count == 0)
            throw new ValidationException("Không thể đăng tải bộ trắc nghiệm không có câu hỏi");

        IsPublished = true;
    }

    public void Unpublish()
    {
        if (IsDeleted)
            throw new ValidationException("Không thể gỡ bỏ đăng tải bộ trắc nghiệm đã bị xóa");

        if (!IsPublished)
            return; // Already unpublished

        IsPublished = false;
    }

    public Question? GetQuestion(Guid questionId)
    {
        return _questions.FirstOrDefault(q => q.Id == questionId);
    }

    public bool CanBeDeleted()
    {
        // Add business rules here, e.g., check if used in active games
        return !IsDeleted;
    }

    public override void Delete()
    {
        if (IsDeleted)
            return; // Already deleted

        base.Delete();
    }

    public int GetQuestionCount() => _questions.Count(q => !q.IsDeleted);

    public int GetTotalTimeLimit() => _questions.Where(q => !q.IsDeleted).Sum(q => q.TimeLimit);

    private static void ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Tiêu đề là bắt buộc");

        if (title.Length > 255)
            throw new ValidationException("Tiêu đề quá dài");
    }

    private static void ValidateDescription(string? description)
    {
        if (description != null && description.Length > 10000)
            throw new ValidationException("Mô tả quá dài");
    }

    private static void ValidateCoverImageUrl(string? coverImageUrl)
    {
        if (coverImageUrl != null && coverImageUrl.Length > 500)
            throw new ValidationException("URL ảnh bìa quá dài");
    }
}