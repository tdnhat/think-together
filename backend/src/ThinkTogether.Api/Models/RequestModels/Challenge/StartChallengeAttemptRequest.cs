namespace ThinkTogether.Api.Models.RequestModels.Challenge;

public record StartChallengeAttemptRequest(
    string Nickname,
    Guid? UserId = null,
    Guid? HomeworkId = null);
