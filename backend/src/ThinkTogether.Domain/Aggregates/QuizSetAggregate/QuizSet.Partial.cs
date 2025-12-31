using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using Shared.Primitives;
using ThinkTogether.Domain.Exceptions;

using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Events;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate;

public sealed partial class QuizSet : AggregateRoot
{
    public void AddQuestion(Question question)
    {
        if (question == null)
            throw new ValidationException("Câu hỏi không được để trống");

        if (question.QuizSetId != Id)
            throw new ValidationException("Câu hỏi không thuộc bộ trắc nghiệm này");

        if (_questions.Any(q => q.Id == question.Id))
            throw new ValidationException("Câu hỏi đã tồn tại trong bộ trắc nghiệm");

        if (_questions.Count >= 100)
            throw new ConflictException("Không được vượt quá 100 câu hỏi mỗi bộ câu hỏi");

        _questions.Add(question);
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new QuestionAddedDomainEvent(
            Id,
            question.Id,
            question.Content));
    }

    public void RemoveQuestion(Guid questionId)
    {
        var question = _questions.FirstOrDefault(q => q.Id == questionId);
        if (question == null)
            throw new EntityNotFoundException(nameof(Question), questionId);

        _questions.Remove(question);
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new QuestionRemovedDomainEvent(Id, questionId));
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

    public void UpdateDescription(string? description)
    {
        Description = description?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateCoverImageUrl(string? imageUrl)
    {
        if (imageUrl != null && imageUrl.Length > 500)
            throw new ValidationException("URL hình ảnh không được vượt quá 500 ký tự");

        CoverImageUrl = imageUrl?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDisplayOrder(int order)
    {
        if (order < 0)
            throw new ValidationException("Thứ tự hiển thị không được âm");

        DisplayOrder = order;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Publish()
    {
        if (_questions.Count == 0)
            throw new ValidationException("Không thể xuất bản bộ câu hỏi không có câu hỏi");

        IsPublished = true;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new QuizSetPublishedDomainEvent(Id));
    }

    public void Unpublish()
    {
        IsPublished = false;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new QuizSetUnpublishedDomainEvent(Id));
    }
}
