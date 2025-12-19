using ThinkTogether.Domain.Aggregates.ClassAggregate;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;

public interface IClassRepository : IRepository<Class, Guid>
{
    Task<Class?> GetByJoinCodeAsync(string joinCode, CancellationToken cancellationToken = default);
    Task<List<Class>> GetByTeacherIdAsync(Guid teacherId, CancellationToken cancellationToken = default);
    Task<List<Class>> GetByMemberIdAsync(Guid memberId, CancellationToken cancellationToken = default);
}
