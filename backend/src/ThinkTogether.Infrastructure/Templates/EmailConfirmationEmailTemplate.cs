namespace ThinkTogether.Infrastructure.Templates;

public static class EmailConfirmationEmailTemplate
{
    public static string Build(string recipientName, string confirmationLink)
    {
        return $@"
<!DOCTYPE html>
<html lang=""vi"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Xác nhận email - ThinkTogether</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }}
        .container {{
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .logo {{
            font-size: 28px;
            font-weight: bold;
            color: #4A90E2;
            margin-bottom: 10px;
        }}
        .title {{
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 20px;
        }}
        .content {{
            margin-bottom: 30px;
        }}
        .button {{
            display: inline-block;
            background-color: #4A90E2;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }}
        .button:hover {{
            background-color: #357ABD;
        }}
        .footer {{
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
        }}
        .warning {{
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <div class=""logo"">🧠 ThinkTogether</div>
            <h1 class=""title"">Xác nhận email của bạn</h1>
        </div>
        
        <div class=""content"">
            <p>Xin chào <strong>{recipientName}</strong>,</p>
            
            <p>Cảm ơn bạn đã đăng ký tài khoản tại ThinkTogether! Để hoàn tất quá trình đăng ký, bạn cần xác nhận địa chỉ email của mình.</p>
            
            <p>Vui lòng nhấp vào nút bên dưới để xác nhận email:</p>
            
            <div style=""text-align: center;"">
                <a href=""{confirmationLink}"" class=""button"">Xác nhận email</a>
            </div>
            
            <div class=""warning"">
                <strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 24 giờ. Nếu bạn không xác nhận email trong thời gian này, bạn sẽ cần yêu cầu gửi lại email xác nhận.
            </div>
            
            <p>Nếu bạn không thể nhấp vào nút trên, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
            <p style=""word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;"">{confirmationLink}</p>
            
            <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
        </div>
        
        <div class=""footer"">
            <p>Trân trọng,<br>Đội ngũ ThinkTogether</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>";
    }
}
