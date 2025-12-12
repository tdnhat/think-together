using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

/// <summary>
/// Represents the user roles in the system.
/// </summary>
public enum RoleType
{
    /// <summary>
    /// Regular user with basic permissions.
    /// </summary>
    [Description("Người dùng thông thường")]
    User = 1,

    /// <summary>
    /// Content creator with additional permissions to create and manage content.
    /// </summary>
    [Description("Người sáng tạo nội dung")]
    Creator = 2,

    /// <summary>
    /// System administrator with full access.
    /// </summary>
    [Description("Quản trị viên")]
    Administrator = 3
}
