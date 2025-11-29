using Domain.Exceptions;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.ValueObjects;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;

public enum QuestionType
{
    SingleChoice,
    TrueFalse,
    MultipleChoice,
    Matching,
    Ordering,
    Video
}

public sealed partial class Question : Entity
{
    private readonly List<QuestionOption> _options = new();
    private readonly List<MatchingPair> _matchingPairs = new();
    private readonly List<OrderingItem> _orderingItems = new();

    private Question()
    {
    }

    public Guid Id { get; private set; }

    public Guid QuizSetId { get; private set; }

    public string Content { get; private set; } = string.Empty;

    public QuestionType Type { get; private set; }

    public int TimeLimit { get; private set; }

    public int DisplayOrder { get; private set; }

    public string? VideoUrl { get; private set; }

    public int? VideoTimestamp { get; private set; }

    public IReadOnlyList<QuestionOption> Options => _options.AsReadOnly();

    public IReadOnlyList<MatchingPair> MatchingPairs => _matchingPairs.AsReadOnly();

    public IReadOnlyList<OrderingItem> OrderingItems => _orderingItems.AsReadOnly();

    public static Question Create(
        Guid quizSetId,
        string content,
        QuestionType type,
        int timeLimit,
        int displayOrder = 0)
    {
        if (quizSetId == Guid.Empty)
            throw new ValidationException("ID bộ câu hỏi không được trống");

        if (string.IsNullOrWhiteSpace(content))
            throw new ValidationException("Nội dung không được trống");

        if (content.Length > 2000)
            throw new ValidationException("Nội dung không được vượt quá 2000 ký tự");

        if (timeLimit <= 0 || timeLimit > 300)
            throw new ValidationException("Giới hạn thời gian phải từ 1 đến 300 giây");

        if (displayOrder < 0)
            throw new ValidationException("Thứ tự hiển thị không được âm");

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


    public void SetMatchingPairs(List<MatchingPair> pairs)
    {
        if (Type != QuestionType.Matching)
            throw new ValidationException("Chỉ câu hỏi ghép cặp mới có thể có cặp ghép");

        if (pairs == null || pairs.Count < 2 || pairs.Count > 5)
            throw new ValidationException("Số lượng cặp ghép phải từ 2 đến 5");

        _matchingPairs.Clear();
        _matchingPairs.AddRange(pairs);
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetOrderingItems(List<OrderingItem> items)
    {
        if (Type != QuestionType.Ordering)
            throw new ValidationException("Chỉ câu hỏi sắp xếp mới có thể có mục sắp xếp");

        if (items == null || items.Count < 3 || items.Count > 6)
            throw new ValidationException("Số lượng mục sắp xếp phải từ 3 đến 6");

        var positions = items.Select(i => i.CorrectPosition).ToList();
        if (positions.Distinct().Count() != positions.Count)
            throw new ValidationException("Vị trí đúng không được trùng lặp");

        _orderingItems.Clear();
        _orderingItems.AddRange(items);
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetVideoDetails(string videoUrl, int videoTimestamp)
    {
        if (Type != QuestionType.Video)
            throw new ValidationException("Chỉ câu hỏi video mới có thể có chi tiết video");

        if (string.IsNullOrWhiteSpace(videoUrl))
            throw new ValidationException("URL video không được trống");

        if (videoUrl.Length > 500)
            throw new ValidationException("URL video không được vượt quá 500 ký tự");

        if (videoTimestamp < 0)
            throw new ValidationException("Dấu thời gian video không được âm");

        VideoUrl = videoUrl.Trim();
        VideoTimestamp = videoTimestamp;
        UpdatedAt = DateTime.UtcNow;
    }
}

