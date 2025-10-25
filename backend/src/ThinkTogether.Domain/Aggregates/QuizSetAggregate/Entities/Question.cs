using Domain.Aggregates.QuizSetAggregate.Enums;
using Domain.Aggregates.QuizSetAggregate.ValueObjects;
using Domain.Exceptions;

using Shared.Primitives;

namespace Domain.Aggregates.QuizSetAggregate.Entities;

public sealed class Question : Entity
{
    private readonly List<Answer> _answers = new();
    private readonly List<MatchPair> _matchPairs = new();
    private readonly List<OrderItem> _orderItems = new();

    // Private constructor for EF Core
    private Question()
    {
    }

    public Guid Id { get; private set; }

    public Guid QuizSetId { get; private set; }

    public string Content { get; private set; } = string.Empty;

    public QuestionType Type { get; private set; }

    public int TimeLimit { get; private set; }

    public int Order { get; private set; }

    public string? VideoUrl { get; private set; }

    public string? Explanation { get; private set; }

    public IReadOnlyList<Answer> Answers => _answers.AsReadOnly();

    public IReadOnlyList<MatchPair> MatchPairs => _matchPairs.AsReadOnly();

    public IReadOnlyList<OrderItem> OrderItems => _orderItems.AsReadOnly();

    public static Question CreateMultipleChoice(
    Guid quizSetId,
    string content,
    int timeLimit,
    int order,
    List<Answer> answers,
    string? explanation = null)
    {
        ValidateCommon(content, timeLimit, order);
        ValidateAnswers(answers, QuestionType.TRACNGHIEM);

        var question = new Question
        {
            Id = Guid.NewGuid(),
            QuizSetId = quizSetId,
            Content = content.Trim(),
            Type = QuestionType.TRACNGHIEM,
            TimeLimit = timeLimit,
            Order = order,
            Explanation = explanation?.Trim()
        };

        question._answers.AddRange(answers);
        return question;
    }

    public static Question CreateTrueFalse(
    Guid quizSetId,
    string content,
    int timeLimit,
    int order,
    bool correctAnswer,
    string? explanation = null)
    {
        ValidateCommon(content, timeLimit, order);

        var answers = new List<Answer>
        {
            Answer.Create("True", correctAnswer, 1),
            Answer.Create("False", !correctAnswer, 2)
        };

        var question = new Question
        {
            Id = Guid.NewGuid(),
            QuizSetId = quizSetId,
            Content = content.Trim(),
            Type = QuestionType.DUNG_SAI,
            TimeLimit = timeLimit,
            Order = order,
            Explanation = explanation?.Trim()
        };

        question._answers.AddRange(answers);
        return question;
    }

    public static Question CreateMatching(
    Guid quizSetId,
    string content,
    int timeLimit,
    int order,
    List<MatchPair> matchPairs,
    string? explanation = null)
    {
        ValidateCommon(content, timeLimit, order);
        ValidateMatchPairs(matchPairs);

        var question = new Question
        {
            Id = Guid.NewGuid(),
            QuizSetId = quizSetId,
            Content = content.Trim(),
            Type = QuestionType.GHEP,
            TimeLimit = timeLimit,
            Order = order,
            Explanation = explanation?.Trim()
        };

        question._matchPairs.AddRange(matchPairs);
        return question;
    }

    public static Question CreateOrdering(
    Guid quizSetId,
    string content,
    int timeLimit,
    int order,
    List<OrderItem> orderItems,
    string? explanation = null)
    {
        ValidateCommon(content, timeLimit, order);
        ValidateOrderItems(orderItems);

        var question = new Question
        {
            Id = Guid.NewGuid(),
            QuizSetId = quizSetId,
            Content = content.Trim(),
            Type = QuestionType.SAPXEP,
            TimeLimit = timeLimit,
            Order = order,
            Explanation = explanation?.Trim()
        };

        question._orderItems.AddRange(orderItems);
        return question;
    }

    public static Question CreateVideo(
    Guid quizSetId,
    string content,
    int timeLimit,
    int order,
    string videoUrl,
    List<Answer> answers,
    string? explanation = null)
    {
        ValidateCommon(content, timeLimit, order);
        ValidateAnswers(answers, QuestionType.VIDEO);

        if (string.IsNullOrWhiteSpace(videoUrl))
            throw new ValidationException("URL video là bắt buộc");

        if (videoUrl.Length > 500)
            throw new ValidationException("URL video quá dài");

        var question = new Question
        {
            Id = Guid.NewGuid(),
            QuizSetId = quizSetId,
            Content = content.Trim(),
            Type = QuestionType.VIDEO,
            TimeLimit = timeLimit,
            Order = order,
            VideoUrl = videoUrl.Trim(),
            Explanation = explanation?.Trim()
        };

        question._answers.AddRange(answers);
        return question;
    }


    public void Update(string content, int timeLimit, string? explanation = null)
    {
        if (IsDeleted)
            throw new ValidationException("Không thể cập nhật câu hỏi đã bị xóa");

        if (string.IsNullOrWhiteSpace(content))
            throw new ValidationException("Nội dung câu hỏi là bắt buộc");

        if (content.Length > 10000)
            throw new ValidationException("Nội dung câu hỏi quá dài");

        if (timeLimit < 5 || timeLimit > 300)
            throw new ValidationException("Thời gian giới hạn phải từ 5 đến 300 giây");

        Content = content.Trim();
        TimeLimit = timeLimit;
        Explanation = explanation?.Trim();
    }

    private static void ValidateCommon(string content, int timeLimit, int order)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ValidationException("Nội dung câu hỏi là bắt buộc");

        if (content.Length > 10000)
            throw new ValidationException("Nội dung câu hỏi quá dài");

        if (timeLimit < 5 || timeLimit > 300)
            throw new ValidationException("Thời gian giới hạn phải từ 5 đến 300 giây");

        if (order < 1)
            throw new ValidationException("Thứ tự câu hỏi phải lớn hơn 0");
    }

    private static void ValidateAnswers(List<Answer> answers, QuestionType type)
    {
        if (answers == null || answers.Count < 2)
            throw new ValidationException($"Câu hỏi {type} cần ít nhất 2 câu trả lời");

        if (answers.Count > 6)
            throw new ValidationException($"Câu hỏi {type} không được có quá 6 câu trả lời");

        var correctCount = answers.Count(a => a.IsCorrect);
        if (correctCount != 1)
            throw new ValidationException($"Câu hỏi {type} phải có đúng 1 câu trả lời đúng");
    }

    private static void ValidateMatchPairs(List<MatchPair> matchPairs)
    {
        if (matchPairs == null || matchPairs.Count < 2)
            throw new ValidationException("Câu hỏi ghép đôi cần ít nhất 2 cặp");

        if (matchPairs.Count > 5)
            throw new ValidationException("Câu hỏi ghép đôi không được có quá 5 cặp");
    }

    private static void ValidateOrderItems(List<OrderItem> orderItems)
    {
        if (orderItems == null || orderItems.Count < 2)
            throw new ValidationException("Câu hỏi sắp xếp cần ít nhất 2 mục");

        if (orderItems.Count > 6)
            throw new ValidationException("Câu hỏi sắp xếp không được có quá 6 mục");

        // Validate that correct positions form a continuous sequence from 1 to N
        var positions = orderItems.Select(oi => oi.CorrectPosition).OrderBy(p => p).ToList();
        var expectedPositions = Enumerable.Range(1, orderItems.Count).ToList();

        if (!positions.SequenceEqual(expectedPositions))
            throw new ValidationException("Vị trí đúng phải tạo thành dãy liên tục từ 1 đến N");
    }
}