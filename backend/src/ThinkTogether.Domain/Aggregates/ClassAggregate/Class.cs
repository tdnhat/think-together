using Domain.Aggregates.ClassAggregate.Entities;
using Shared.Primitives;

namespace Domain.Aggregates.ClassAggregate;

public sealed class Class : AggregateRoot
{
    private readonly List<ClassMember> _members = new();
    private readonly List<Homework> _homeworks = new();

    private Class()
    {
    }

    public Guid Id { get; private set; }

    public Guid TeacherId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public string JoinCode { get; private set; } = string.Empty;

    public string? CoverImageUrl { get; private set; }

    public IReadOnlyList<ClassMember> Members => _members.AsReadOnly();

    public IReadOnlyList<Homework> Homeworks => _homeworks.AsReadOnly();

    public static Class Create(
        Guid teacherId,
        string name,
        string? description = null,
        string joinCode = "")
    {
        if (teacherId == Guid.Empty)
            throw new ArgumentException("Teacher ID cannot be empty", nameof(teacherId));

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty", nameof(name));

        if (name.Length > 255)
            throw new ArgumentException("Name cannot exceed 255 characters", nameof(name));

        var code = string.IsNullOrWhiteSpace(joinCode) ? GenerateJoinCode() : joinCode;

        if (code.Length != 8)
            throw new ArgumentException("Join code must be 8 characters", nameof(joinCode));

        return new Class
        {
            Id = Guid.NewGuid(),
            TeacherId = teacherId,
            Name = name.Trim(),
            Description = description?.Trim(),
            JoinCode = code,
            CoverImageUrl = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void AddMember(ClassMember member)
    {
        if (member == null)
            throw new ArgumentNullException(nameof(member));

        var existingMember = _members.FirstOrDefault(m => m.UserId == member.UserId && m.LeftAt == null);
        if (existingMember != null)
            throw new InvalidOperationException("User is already a member of this class");

        _members.Add(member);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveMember(Guid memberId)
    {
        var member = _members.FirstOrDefault(m => m.Id == memberId);
        if (member != null)
        {
            member.MarkAsLeft();
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void AddHomework(Homework homework)
    {
        if (homework == null)
            throw new ArgumentNullException(nameof(homework));

        _homeworks.Add(homework);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveHomework(Guid homeworkId)
    {
        var homework = _homeworks.FirstOrDefault(h => h.Id == homeworkId);
        if (homework != null)
        {
            homework.Delete();
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void UpdateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty", nameof(name));

        if (name.Length > 255)
            throw new ArgumentException("Name cannot exceed 255 characters", nameof(name));

        Name = name.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDescription(string? description)
    {
        Description = description?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateCoverImageUrl(string? imageUrl)
    {
        if (imageUrl != null && imageUrl.Length > 500)
            throw new ArgumentException("Image URL cannot exceed 500 characters", nameof(imageUrl));

        CoverImageUrl = imageUrl?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    private static string GenerateJoinCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        var code = new string(Enumerable.Range(0, 8)
            .Select(_ => chars[random.Next(chars.Length)])
            .ToArray());
        return code;
    }
}

