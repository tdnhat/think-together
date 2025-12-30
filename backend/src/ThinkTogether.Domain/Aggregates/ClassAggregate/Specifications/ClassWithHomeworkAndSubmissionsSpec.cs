using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Specifications;

/// <summary>
/// Specification to get class with specific homework and its submissions by homework ID
/// </summary>
public sealed class ClassWithHomeworkAndSubmissionsSpec : Specification<Class>
{
    public ClassWithHomeworkAndSubmissionsSpec(Guid homeworkId)
    {
        Criteria = c => c.Id != Guid.Empty && c.DeletedAt == null &&
                       c.Homeworks.Any(h => h.Id == homeworkId && h.DeletedAt == null);

        // Include members and homeworks with submissions
        AddInclude(c => c.Members.Where(m => m.LeftAt == null));
        AddInclude(c => c.Homeworks.Where(h => h.Id == homeworkId && h.DeletedAt == null));
        AddInclude("Homeworks.Submissions");
    }
}

/// <summary>
/// Specification to get class with all members and homework statistics by homework ID
/// </summary>
public sealed class ClassWithHomeworkStatisticsSpec : Specification<Class>
{
    public ClassWithHomeworkStatisticsSpec(Guid homeworkId)
    {
        Criteria = c => c.Id != Guid.Empty && c.DeletedAt == null &&
                       c.Homeworks.Any(h => h.Id == homeworkId && h.DeletedAt == null);

        // Include all members and the specific homework with submissions
        AddInclude(c => c.Members.Where(m => m.LeftAt == null));
        AddInclude(c => c.Homeworks.Where(h => h.Id == homeworkId && h.DeletedAt == null));
        AddInclude("Homeworks.Submissions");
    }
}
