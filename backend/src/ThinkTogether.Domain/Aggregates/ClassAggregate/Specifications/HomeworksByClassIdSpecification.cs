using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Specifications;

public sealed class HomeworksByClassIdSpecification : Specification<Class>
{
    public HomeworksByClassIdSpecification(
        Guid classId,
        string? sortBy = null,
        int page = 1,
        int pageSize = 20)
    {
        // Base criteria: class ID and not deleted
        Criteria = classEntity => classEntity.Id == classId && classEntity.DeletedAt == null;

        // Include homeworks
        AddInclude(classEntity => classEntity.Homeworks);

        // Note: Sorting and pagination for homeworks will be handled in the handler
        // since homeworks are entities within the aggregate, not aggregates themselves
    }
}

