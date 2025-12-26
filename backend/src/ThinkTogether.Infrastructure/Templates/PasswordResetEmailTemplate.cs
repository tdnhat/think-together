using System.Globalization;

namespace ThinkTogether.Infrastructure.Templates;

internal static class PasswordResetEmailTemplate
{
    internal static string Build(string recipientName, string resetLink)
    {
        string template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        body { font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; background-color: #f1f5f9; margin: 0; padding: 0; line-height: 1.6; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background: #ffffff; padding: 40px 40px 20px 40px; text-align: center; }
        .logo { font-size: 48px; margin-bottom: 16px; display: inline-block; }
        .title { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; letter-spacing: -0.025em; }
        .content { padding: 20px 40px 40px 40px; font-size: 16px; color: #334155; }
        .content p { margin: 16px 0; }
        .content strong { color: #0f172a; font-weight: 600; }
        .button-container { text-align: center; margin: 32px 0; }
        .button { display: inline-block; background-color: #ef4444; color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 50px; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2); }
        .button:hover { background-color: #dc2626; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #b91c1c; padding: 16px; margin: 24px 0; font-weight: 500; font-size: 14px; text-align: center; }
        .link-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #64748b; word-break: break-all; margin-top: 24px; }
        .footer { background-color: #f8fafc; padding: 32px 24px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        @media only screen and (max-width: 600px) {
            .container { margin: 0; border-radius: 0; }
            .content { padding: 20px; }
            .header { padding: 30px 20px 20px 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔐</div>
            <h1 class="title">Đặt lại mật khẩu</h1>
        </div>
        <div class="content">
            <p>Xin chào <strong>{0}</strong>,</p>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản ThinkTogether của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            <div class="button-container">
                <a href="{1}" class="button">Đặt lại mật khẩu</a>
            </div>
            <div class="warning">
                ⏰ Liên kết này sẽ hết hạn sau 1 giờ.
            </div>
            <p>Nếu nút trên không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt của mình:</p>
            <div class="link-box">{1}</div>
            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">Vì lý do bảo mật, vui lòng không chia sẻ liên kết này với bất kỳ ai.</p>
        </div>
        <div class="footer">
            <p style="margin: 0 0 8px 0;">© 2025 ThinkTogether. Bảo lưu mọi quyền.</p>
            <p style="margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>
""";

        return string.Format(CultureInfo.InvariantCulture, template, recipientName, resetLink);
    }
}
