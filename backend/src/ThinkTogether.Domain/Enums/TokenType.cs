using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum TokenType
{
    [Description("Đặt lại mật khẩu")]
    PasswordReset = 1,

    [Description("Xác nhận email")]
    EmailConfirmation = 2
}

