using System.Globalization;

namespace ThinkTogether.Infrastructure.Templates;

internal static class WelcomeEmailTemplate
{
    internal static string Build(string recipientName)
    {
        const string template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; }}
        .content {{ padding: 20px; background: #f9f9f9; border-radius: 5px; margin-top: 20px; }}
        .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; }}
        .button {{ display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to ThinkTogether!</h1>
        </div>
        <div class="content">
            <p>Hi {0},</p>
            <p>Thank you for registering with ThinkTogether! We're excited to have you on board.</p>
            <p>ThinkTogether is an interactive quiz platform designed to make learning engaging and fun. Create custom quizzes, challenge friends, and track your progress all in one place.</p>
            <p><strong>What you can do now:</strong></p>
            <ul>
                <li>Create your own quiz sets</li>
                <li>Host live games and invite others</li>
                <li>Track your performance and statistics</li>
                <li>Compete with friends and colleagues</li>
            </ul>
            <p>Get started by logging in to your account and creating your first quiz!</p>
        </div>
        <div class="footer">
            <p>© 2025 ThinkTogether. All rights reserved.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
    </div>
</body>
</html>
""";

        return string.Format(CultureInfo.InvariantCulture, template, recipientName);
    }
}
