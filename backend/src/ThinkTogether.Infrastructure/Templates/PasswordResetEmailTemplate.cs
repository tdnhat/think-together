using System.Globalization;

namespace ThinkTogether.Infrastructure.Templates;

internal static class PasswordResetEmailTemplate
{
    internal static string Build(string recipientName, string resetLink)
    {
        const string template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #ff6b6b; color: white; padding: 20px; border-radius: 5px; text-align: center; }}
        .content {{ padding: 20px; background: #f9f9f9; border-radius: 5px; margin-top: 20px; }}
        .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; }}
        .button {{ display: inline-block; padding: 10px 20px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
        .warning {{ color: #ff6b6b; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hi {0},</p>
            <p>We received a request to reset your ThinkTogether password. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <a href="{1}" class="button">Reset Password</a>
            <p><span class="warning">⚠️ This link will expire in 1 hour.</span></p>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p><code>{1}</code></p>
        </div>
        <div class="footer">
            <p>© 2025 ThinkTogether. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
""";

        return string.Format(CultureInfo.InvariantCulture, template, recipientName, resetLink);
    }
}
