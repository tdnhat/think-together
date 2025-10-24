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
            <h1>Confirm Your Email</h1>
        </div>
        <div class="content">
            <p>Hi {0},</p>
            <p>Welcome to ThinkTogether! Please confirm your email address to complete your registration.</p>
            <p>Click the button below to confirm your email:</p>
            <a href="{1}" class="button">Confirm Email</a>
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

        return string.Format(CultureInfo.InvariantCulture, template, recipientName, confirmationLink);
    }
}
