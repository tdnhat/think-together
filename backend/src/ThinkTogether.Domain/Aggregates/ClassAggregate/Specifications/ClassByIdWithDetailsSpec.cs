using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Specifications;

/// <summary>
/// Specification to get class by ID with all related entities (Members, Homeworks, Submissions)
/// </summary>
public sealed class ClassByIdWithDetailsSpec : Specification<Class>
{
    public ClassByIdWithDetailsSpec(Guid id)
    {
        Criteria = c => c.Id == id && c.DeletedAt == null;
        
        // Include Members (filter out left members)
        AddInclude(c => c.Members);
        
        // Include Homeworks (filter out deleted homeworks)
        AddInclude(c => c.Homeworks);
        
        // Include Submissions for each homework
        // Note: ThenInclude is handled in repository implementation
    }
}
