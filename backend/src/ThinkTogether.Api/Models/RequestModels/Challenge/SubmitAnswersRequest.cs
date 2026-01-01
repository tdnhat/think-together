using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Api.Models.RequestModels.Challenge;

public record SubmitAnswersRequest(
    List<AnswerSubmissionItemDto> Answers,
    Guid? HomeworkId = null);

public record AnswerSubmissionItemDto(
    Guid QuestionId,
    List<int>? SelectedOptionIndexes = null,
    List<AnswerMatchingPairDto>? MatchingPairs = null,
    List<AnswerOrderingItemDto>? OrderingItems = null);
