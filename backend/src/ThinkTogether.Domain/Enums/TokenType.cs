using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

/// <summary>
/// Represents the type of user token.
/// </summary>
public enum TokenType
{
    /// <summary>
    /// Token used for password reset functionality.
    /// </summary>
    [Description("Đặt lại mật khẩu")]
    PasswordReset = 1,

    /// <summary>
    /// Token used for email confirmation/verification.
    /// </summary>
    [Description("Xác nhận email")]
    EmailConfirmation = 2
}

