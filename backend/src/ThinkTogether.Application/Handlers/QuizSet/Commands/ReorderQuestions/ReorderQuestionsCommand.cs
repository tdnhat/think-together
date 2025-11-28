using MediatR;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.ReorderQuestions;

public sealed record ReorderQuestionsCommand(
    Guid QuizSetId,
    List<QuestionOrder> Questions) : IRequest;

public sealed record QuestionOrder(Guid QuestionId, int DisplayOrder);
