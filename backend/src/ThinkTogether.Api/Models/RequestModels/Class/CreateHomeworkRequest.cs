namespace ThinkTogether.Api.Models.RequestModels.Class;

public record CreateHomeworkRequest(
    Guid QuizSetId,
    string Title,
    DateTime? DueDate = null);
