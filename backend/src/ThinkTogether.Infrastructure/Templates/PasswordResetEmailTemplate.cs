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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{ font-family: 'Be Vietnam Pro', Arial, sans-serif; color: #003459; background-color: #f8fafc; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ 
            background: #ffffff; 
            border: 2px solid #ef4444; 
            border-radius: 12px; 
            padding: 30px; 
            text-align: center; 
            box-shadow: 6px 6px 0 #ef4444;
            margin-bottom: 20px;
        }}
        .header h1 {{ 
            font-family: 'Raleway', Arial, sans-serif;
            font-size: 28px; 
            font-weight: 700; 
            margin: 0; 
            color: #ef4444;
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
        .button {{ 
            display: inline-block; 
            background: #ef4444; 
            color: white; 
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
        .warning {{ 
            background: #fee2e2;
            border: 2px solid #ef4444;
            border-radius: 8px;
            color: #991b1b; 
            font-weight: 600;
            padding: 15px;
            margin: 20px 0;
        }}
        .link-box {{
            background: #f8fafc;
            border: 2px dashed #ef4444;
            border-radius: 8px;
            padding: 12px;
            margin: 15px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 13px;
            color: #334155;
        }}
        .footer {{ 
            text-align: center; 
            color: #334155; 
            font-size: 13px; 
            margin-top: 20px;
            padding: 20px;
            border-top: 2px solid #00171f;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔐</div>
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{0}</strong>,</p>
            <p>We received a request to reset your ThinkTogether password. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center;">
                <a href="{1}" class="button">🔄 Reset Password</a>
            </div>
            <div class="warning">
                ⏰ This link will expire in 1 hour.
            </div>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <div class="link-box">{1}</div>
            <p>For security reasons, never share this link with anyone.</p>
        </div>
        <div class="footer">
            <p>© 2025 ThinkTogether. All rights reserved.</p>
            <p>This is an automated email. Please don't reply to this message.</p>
        </div>
    </div>
</body>
</html>
""";

        return string.Format(CultureInfo.InvariantCulture, template, recipientName, resetLink);
    }
}
