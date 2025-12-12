using ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;
using Shared.Primitives;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

public sealed partial class Question : Entity
{
    public void AddOption(QuestionOption option)
    {
        if (option == null)
            throw new ValidationException("Tùy chọn không được null");

        if (_options.Count >= 10)
            throw new ConflictException("Không được vượt quá 10 tùy chọn mỗi câu hỏi");

        _options.Add(option);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveOption(int index)
    {
        if (index < 0 || index >= _options.Count)
            throw new ValidationException("Chỉ số ngoài phạm vi");

        _options.RemoveAt(index);
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetOptions(List<QuestionOption> options)
    {
        if (Type != QuestionType.SingleChoice && 
            Type != QuestionType.TrueFalse && 
            Type != QuestionType.MultipleChoice)
            throw new ValidationException("Chỉ câu hỏi trắc nghiệm mới có thể có lựa chọn");

        if (options == null || options.Count == 0)
            throw new ValidationException("Phải có ít nhất một lựa chọn");

        if (Type == QuestionType.TrueFalse && options.Count != 2)
            throw new ValidationException("Câu hỏi đúng/sai phải có đúng 2 lựa chọn");

        if (Type != QuestionType.TrueFalse && (options.Count < 2 || options.Count > 6))
            throw new ValidationException("Số lượng lựa chọn phải từ 2 đến 6");

        if (!options.Any(o => o.IsCorrect))
            throw new ValidationException("Phải có ít nhất một đáp án đúng");

        if (Type == QuestionType.SingleChoice && options.Count(o => o.IsCorrect) != 1)
            throw new ValidationException("Câu hỏi một lựa chọn phải có đúng một đáp án đúng");

        _options.Clear();
        _options.AddRange(options);
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateContent(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ValidationException("Nội dung không được trống");

        if (content.Length > 2000)
            throw new ValidationException("Nội dung không được vượt quá 2000 ký tự");

        Content = content.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateTimeLimit(int timeLimit)
    {
        if (timeLimit <= 0 || timeLimit > 300)
            throw new ValidationException("Giới hạn thời gian phải từ 1 đến 300 giây");

        TimeLimit = timeLimit;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDisplayOrder(int order)
    {
        if (order < 0)
            throw new ValidationException("Thứ tự hiển thị không được âm");

        DisplayOrder = order;
        UpdatedAt = DateTime.UtcNow;
    }
}
