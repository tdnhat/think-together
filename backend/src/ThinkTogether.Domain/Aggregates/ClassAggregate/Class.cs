using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;
using ThinkTogether.Domain.Exceptions;
using Shared.Primitives;

namespace ThinkTogether.Domain.Aggregates.ClassAggregate;

public sealed partial class Class : AggregateRoot
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
            throw new ValidationException("ID giáo viên không được trống");

        if (string.IsNullOrWhiteSpace(name))
            throw new ValidationException("Tên không được trống");

        if (name.Length > 255)
            throw new ValidationException("Tên không được vượt quá 255 ký tự");

        var code = string.IsNullOrWhiteSpace(joinCode) ? GenerateJoinCode() : joinCode;

        if (code.Length != 8)
            throw new ValidationException("Mã tham gia phải có 8 ký tự");

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
