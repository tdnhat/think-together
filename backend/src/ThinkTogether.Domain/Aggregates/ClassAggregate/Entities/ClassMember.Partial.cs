namespace ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;

public sealed partial class ClassMember
{
    public void MarkAsLeft()
    {
        if (LeftAt == null)
        {
            LeftAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
