using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Entities;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Exceptions;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Application.Handlers.Challenge.Commands.SubmitAnswer;

public sealed class SubmitAnswerCommandHandler : IRequestHandler<SubmitAnswerCommand, ChallengeAnswerDto>
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SubmitAnswerCommandHandler(
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        IUnitOfWork unitOfWork)
    {
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ChallengeAnswerDto> Handle(SubmitAnswerCommand request, CancellationToken cancellationToken)
    {
        var spec = new ChallengeByAttemptIdSpec(request.AttemptId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", request.AttemptId);

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == request.AttemptId)
            ?? throw new EntityNotFoundException("Lượt chơi", request.AttemptId);

        if (attempt.Status != AttemptStatus.InProgress)
            throw new ConflictException("Lượt chơi không còn trong trạng thái đang làm");

        var quizSet = await _quizSetRepository.GetByIdAsync(challenge.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", challenge.QuizSetId);

        var question = quizSet.Questions.FirstOrDefault(q => q.Id == request.QuestionId)
            ?? throw new EntityNotFoundException("Câu hỏi", request.QuestionId);

        // Calculate elapsed time since attempt started
        var elapsedMs = (int)(DateTime.UtcNow - attempt.StartedAt).TotalMilliseconds;

        // Validate and check answer based on question type
        bool isCorrect = false;
        int pointsEarned = 0;

        switch (question.Type)
        {
            case QuestionType.SingleChoice:
            case QuestionType.MultipleChoice:
            case QuestionType.TrueFalse:
                if (request.SelectedOptionIndexes == null || !request.SelectedOptionIndexes.Any())
                    throw new ValidationException("Vui lòng chọn ít nhất một phương án");

                var correctIndexes = question.Options
                    .Select((o, index) => new { Option = o, Index = index })
                    .Where(x => x.Option.IsCorrect)
                    .Select(x => x.Index)
                    .ToList();

                isCorrect = request.SelectedOptionIndexes.Count == correctIndexes.Count &&
                           request.SelectedOptionIndexes.All(i => correctIndexes.Contains(i));
                break;

            case QuestionType.Matching:
                if (request.MatchingPairs == null || !request.MatchingPairs.Any())
                    throw new ValidationException("Vui lòng ghép cặp");

                // Compare matching pairs
                var correctPairs = question.MatchingPairs.OrderBy(p => p.DisplayOrder).ToList();
                var submittedPairs = request.MatchingPairs.OrderBy(p => p.LeftContent).ToList();

                if (correctPairs.Count != submittedPairs.Count)
                {
                    isCorrect = false;
                }
                else
                {
                    isCorrect = correctPairs.All(cp =>
                        submittedPairs.Any(sp =>
                            sp.LeftContent == cp.LeftContent &&
                            sp.RightContent == cp.RightContent));
                }
                break;

            case QuestionType.Ordering:
                if (request.OrderingItems == null || !request.OrderingItems.Any())
                    throw new ValidationException("Vui lòng sắp xếp các mục");

                var correctOrder = question.OrderingItems
                    .OrderBy(i => i.CorrectPosition)
                    .Select(i => i.Content)
                    .ToList();

                var submittedOrder = request.OrderingItems
                    .OrderBy(i => i.Position)
                    .Select(i => i.Content)
                    .ToList();

                isCorrect = correctOrder.SequenceEqual(submittedOrder);
                break;

            default:
                throw new ValidationException("Loại câu hỏi không được hỗ trợ");
        }

        // Calculate points (simple: 10 points per correct answer, 0 for wrong)
        pointsEarned = isCorrect ? 10 : 0;

        // Convert DTOs to domain entities
        List<AnswerMatchingPair>? matchingPairs = null;
        if (request.MatchingPairs != null)
        {
            matchingPairs = request.MatchingPairs.Select(p => new AnswerMatchingPair
            {
                LeftContent = p.LeftContent,
                RightContent = p.RightContent
            }).ToList();
        }

        List<AnswerOrderingItem>? orderingItems = null;
        if (request.OrderingItems != null)
        {
            orderingItems = request.OrderingItems.Select(i => new AnswerOrderingItem
            {
                Content = i.Content,
                Position = i.Position
            }).ToList();
        }

        var answer = ChallengeAnswer.Create(
            attempt.Id,
            question.Id,
            elapsedMs,
            isCorrect,
            pointsEarned,
            request.SelectedOptionIndexes,
            matchingPairs,
            orderingItems);

        attempt.UpdateAnswer(answer);

        await _challengeRepository.UpdateAsync(challenge, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ChallengeAnswerDto
        {
            Id = answer.Id,
            QuestionId = answer.QuestionId,
            SubmissionTimeMs = answer.SubmissionTimeMs,
            IsCorrect = answer.IsCorrect,
            PointsEarned = answer.PointsEarned,
            SelectedOptionIndexes = answer.SelectedOptionIndexes.ToList(),
            MatchingPairs = answer.MatchingPairs.Select(p => new AnswerMatchingPairDto
            {
                LeftContent = p.LeftContent,
                RightContent = p.RightContent
            }).ToList(),
            OrderingItems = answer.OrderingItems.Select(i => new AnswerOrderingItemDto
            {
                Content = i.Content,
                Position = i.Position
            }).ToList()
        };
    }
}
