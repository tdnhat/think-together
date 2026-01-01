namespace ThinkTogether.Api.Models.RequestModels.Challenge;

public record CreateChallengeRequest(
    Guid QuizSetId,
    string? Title = null);
