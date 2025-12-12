using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate;

public sealed partial class Class : AggregateRoot
{
    public void AddMember(ClassMember member)
    {
        if (member == null)
            throw new ValidationException("Thành viên không được null");

        var existingMember = _members.FirstOrDefault(m => m.UserId == member.UserId && m.LeftAt == null);
        if (existingMember != null)
            throw new ConflictException("Người dùng đã là thành viên của lớp này");

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
            throw new ValidationException("Bài tập về nhà không được null");

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
            throw new ValidationException("Tên không được trống");

        if (name.Length > 255)
            throw new ValidationException("Tên không được vượt quá 255 ký tự");

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
            throw new ValidationException("URL hình ảnh không được vượt quá 500 ký tự");

        CoverImageUrl = imageUrl?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
