using System.Globalization;

namespace ThinkTogether.Infrastructure.Templates;

internal static class WelcomeEmailTemplate
{
    internal static string Build(string recipientName)
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
        .content ul { list-style: none; padding: 0; margin: 24px 0; }
        .content li { margin: 12px 0; padding-left: 0; }
        .button-container { text-align: center; margin: 32px 0; }
        .button { display: inline-block; background-color: #eab308; color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 50px; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(234, 179, 8, 0.2); }
        .button:hover { background-color: #ca8a04; }
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
            <div class="logo">🧠</div>
            <h1 class="title">Chào mừng đến với ThinkTogether!</h1>
        </div>
        <div class="content">
            <p>Xin chào <strong>{0}</strong>,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản! Chúng tôi rất vui mừng được chào đón bạn gia nhập cộng đồng. 🎉</p>
            <p>ThinkTogether là nền tảng câu đố tương tác giúp việc học và giải trí trở nên thú vị hơn bao giờ hết. Tại đây bạn có thể:</p>
            <ul>
                <li>✨ Tạo bộ câu đố của riêng bạn</li>
                <li>🎮 Tổ chức trò chơi trực tiếp mời bạn bè</li>
                <li>📊 Theo dõi kết quả và thống kê chi tiết</li>
                <li>🏆 Thi đấu và leo bảng xếp hạng</li>
            </ul>
            <p>Hãy bắt đầu hành trình của bạn bằng cách tạo câu đố đầu tiên ngay hôm nay!</p>
            <div class="button-container">
                <a href="#" class="button">Bắt đầu ngay</a>
            </div>
        </div>
        <div class="footer">
            <p style="margin: 0 0 8px 0;">© 2025 ThinkTogether. Bảo lưu mọi quyền.</p>
            <p style="margin: 0;">Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
        </div>
    </div>
</body>
</html>
""";

        return string.Format(CultureInfo.InvariantCulture, template, recipientName);
    }
}
