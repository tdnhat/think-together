using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum RoleType
{
    [Description("Người dùng thông thường")]
    User = 1,

    [Description("Người sáng tạo nội dung")]
    Creator = 2,

    [Description("Quản trị viên")]
    Administrator = 3
}
