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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{ font-family: 'Be Vietnam Pro', Arial, sans-serif; color: #003459; background-color: #f8fafc; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ 
            background: #ffffff; 
            border: 2px solid #00171f; 
            border-radius: 12px; 
            padding: 30px; 
            text-align: center; 
            box-shadow: 6px 6px 0 #00171f;
            margin-bottom: 20px;
        }}
        .header h1 {{ 
            font-family: 'Raleway', Arial, sans-serif;
            font-size: 28px; 
            font-weight: 700; 
            margin: 0 0 10px 0; 
            color: #003459;
        }}
        .logo {{ font-size: 32px; margin-bottom: 10px; }}
        .content {{ 
            background: #ffffff; 
            border: 2px solid #00171f; 
            border-radius: 12px; 
            padding: 30px; 
            box-shadow: 6px 6px 0 #00171f;
            margin-bottom: 20px;
        }}
        .content p {{ 
            font-size: 16px; 
            line-height: 1.6; 
            margin: 15px 0; 
            color: #334155;
        }}
        .content strong {{ color: #003459; }}
        .content ul {{ 
            margin: 15px 0; 
            padding-left: 20px; 
            color: #334155;
        }}
        .content li {{ margin: 8px 0; }}
        .button {{ 
            display: inline-block; 
            background: #ffe066; 
            color: #003459; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            font-family: 'Quicksand', Arial, sans-serif;
            border: 2px solid #00171f;
            box-shadow: 4px 4px 0 #00171f;
            margin-top: 20px;
            transition: all 0.2s ease;
            display: inline-block;
        }}
        .button:hover {{ 
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 #00171f;
        }}
        .footer {{ 
            text-align: center; 
            color: #334155; 
            font-size: 13px; 
            margin-top: 20px;
            padding: 20px;
            border-top: 2px solid #00171f;
        }}
        .highlight {{ color: #00a8e8; font-weight: 600; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🧠</div>
            <h1>Welcome to ThinkTogether!</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{0}</strong>,</p>
            <p>Thank you for registering with ThinkTogether! We're excited to have you on board. 🎉</p>
            <p>ThinkTogether is an interactive quiz platform designed to make learning engaging and fun. Create custom quizzes, challenge friends, and track your progress all in one place.</p>
            <p><strong>What you can do now:</strong></p>
            <ul>
                <li>✨ Create your own quiz sets</li>
                <li>🎮 Host live games and invite others</li>
                <li>📊 Track your performance and statistics</li>
                <li>🏆 Compete with friends and colleagues</li>
            </ul>
            <p>Get started by logging in to your account and creating your first quiz!</p>
            <div style="text-align: center;">
                <a href="#" class="button">Get Started</a>
            </div>
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
