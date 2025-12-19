using ThinkTogether.Domain.Aggregates.ClassAggregate;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;

public interface IClassRepository : IRepository<Class, Guid>
{
    Task<Class?> GetByJoinCodeAsync(string joinCode, CancellationToken cancellationToken = default);
    Task<List<Class>> GetByTeacherIdAsync(Guid teacherId, CancellationToken cancellationToken = default);
    Task<List<Class>> GetByMemberIdAsync(Guid memberId, CancellationToken cancellationToken = default);
    Task<Class?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Homework?> GetHomeworkByQuizSetIdAsync(Guid quizSetId, CancellationToken cancellationToken = default);
    Task<(Class Class, Homework Homework)?> GetClassAndHomeworkByHomeworkIdAsync(Guid homeworkId, CancellationToken cancellationToken = default);
    Task<List<(HomeworkSubmission Submission, Homework Homework, Class Class)>> GetHomeworkSubmissionsByAttemptIdsAsync(List<Guid> attemptIds, CancellationToken cancellationToken = default);
}
