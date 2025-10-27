using System.Globalization;

namespace ThinkTogether.Infrastructure.Templates;

internal static class EmailConfirmationTemplate
{
    internal static string Build(string recipientName, string confirmationLink)
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
            margin: 0; 
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
        .button {{ 
            display: inline-block; 
            background: #00a8e8; 
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
        .link-box {{
            background: #f8fafc;
            border: 2px dashed #00a8e8;
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
            <div class="logo">🧠</div>
            <h1>Confirm Your Email</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{0}</strong>,</p>
            <p>Welcome to ThinkTogether! 🎉 Please confirm your email address to complete your registration.</p>
            <p>Click the button below to verify your email:</p>
            <div style="text-align: center;">
                <a href="{1}" class="button">✓ Confirm Email</a>
            </div>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <div class="link-box">{1}</div>
            <p>Didn't create this account? You can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2025 ThinkTogether. All rights reserved.</p>
            <p>This is an automated email. Please don't reply to this message.</p>
        </div>
    </div>
</body>
</html>
""";

        return string.Format(CultureInfo.InvariantCulture, template, recipientName, confirmationLink);
    }
}
