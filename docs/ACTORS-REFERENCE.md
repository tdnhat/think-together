# ThinkTogether - Actors Reference Guide

**Purpose:** Tài liệu này cung cấp tóm tắt nhanh về các Actors trong hệ thống ThinkTogether để dễ hiểu và tham khảo.

**Date:** October 16, 2025  
**Status:** Active

---

## 📋 Quick Overview

Hệ thống ThinkTogether có **4 loại Actor chính:**

### 1️⃣ **Giáo viên (Teacher)** 🎓
**Vai trò:** Người tạo nội dung và tổ chức phiên học tập

**Đặc điểm:**
- Phải đăng ký & đăng nhập
- Sở hữu Quiz Sets
- Host Live Games
- Tạo Challenge Links
- Xem báo cáo chi tiết

**Hoạt động chính:**
```
Đăng ký/Đăng nhập 
    ↓
Tạo Quiz (Quizzes)
    ↓
Thêm Câu hỏi (Questions)
    ↓
Tổ chức Phiên chơi:
    - Live Game (Đồng bộ với Học sinh)
    - Challenge (Bất đồng bộ, Học sinh tự luyện)
    ↓
Xem Báo cáo & Phân tích
```

**Quyền chính:**
- ✅ Create/Edit/Delete own Quizzes
- ✅ Create Challenge Links
- ✅ Host Live Games
- ✅ View own Reports & Analytics
- ✅ Export data to CSV
- ❌ Cannot play as Student
- ❌ Cannot access others' content

---

### 2️⃣ **Học sinh (Student)** 👨‍🎓
**Vai trò:** Người tham gia học tập qua game

**Đặc điểm:**
- Không cần tài khoản
- Chỉ cần Nickname
- Join via PIN (Live) hoặc Link (Challenge)
- Ẩn danh hoàn toàn

**Hoạt động chính:**
```
Truy cập ứng dụng
    ↓
Nhập PIN hoặc Link
    ↓
Nhập Nickname
    ↓
Tham gia Phiên chơi:
    - Live Game (Real-time)
    - Challenge (Solo)
    ↓
Xem Kết quả & Bảng xếp hạng
```

**Quyền chính:**
- ✅ Join Live Game (with PIN)
- ✅ Join Challenge (with Link)
- ✅ View own scores & ranking
- ✅ Toggle audio settings
- ❌ Cannot create content
- ❌ Cannot access reports

---

### 3️⃣ **Quản trị viên (Administrator)** 🔐
**Vai trò:** Quản lý hệ thống & giám sát nội dung

**Đặc điểm:**
- Tài khoản với quyền cao
- Quyền truy cập toàn bộ dữ liệu
- Kiểm duyệt nội dung
- Monitor hệ thống

**Hoạt động chính:**
```
Đăng nhập Admin Dashboard
    ↓
Giám sát:
    - Users & Content
    - Profanity & Inappropriate Content
    - System Performance
    ↓
Quản lý:
    - Ban/Delete Users
    - Delete Quiz Sets
    - Moderate Comments
    ↓
Xem System-wide Analytics
```

**Quyền chính:**
- ✅ View/Delete any Quiz Sets
- ✅ View/Ban/Delete Users
- ✅ View all Games & Reports
- ✅ Monitor Profanity Filters
- ✅ System Configuration
- ✅ Audit Trail Access

---

### 4️⃣ **Người dùng phổ thông (Guest/Anonymous)** 👤
**Vai trò:** Người truy cập trang chủ hoặc được mời

**Đặc điểm:**
- Không cần tài khoản
- Chỉ truy cập nội dung công khai
- Có thể join game nếu được mời

**Hoạt động chính:**
```
Truy cập Trang chủ
    ↓
Khám phá Tính năng
    ↓
Có thể:
    - Xem Giới thiệu
    - Đăng ký/Đăng nhập
    - Join Game (nếu có PIN/Link)
```

**Quyền chính:**
- ✅ View public homepage
- ✅ View system info
- ✅ Access Sign Up/Login
- ✅ Join game with PIN/Link
- ❌ Cannot create content

---

## 🔄 Interaction Flows

### Live Game Flow

```
Giáo viên                          Học sinh
   |                                  |
   |-- Tạo Lobby (PIN) ------------->|
   |                                  | Nhập PIN + Nickname
   |-- Chờ Học sinh join ----------->|
   |                                  | Tham gia Lobby
   |-- Bắt đầu Game (Start) -------->|
   |                                  | Chơi Câu 1
   |-- Hiển thị Câu hỏi 1 -------->|
   |                              | Trả lời
   |<-------- Submit Answer ---------|
   |-- Hiển thị Kết quả ---------->|
   |                              | Xem Kết quả
   |-- Tiếp tục Câu 2-n ---------->|
   |                              | (Lặp lại)
   |-- Hiển thị Podium Final ----->|
   |                              | Xem Bảng xếp hạng
```

### Challenge Flow

```
Giáo viên                     Học sinh
   |                             |
   |-- Tạo Challenge Link ------>|
   |                             | Nhận Link
   |                             | Truy cập Link
   |                             | Nhập Nickname
   |                             | Play Solo
   |                             | Submit Score
   |                             | Xem Leaderboard
   | (Persistent - có thể play lại)
```

---

## 📊 Use Case Distribution

| Module | Giáo viên | Học sinh | Quản trị viên |
|--------|-----------|----------|---------------|
| Authentication | ✅ Register/Login | ❌ | ✅ |
| Content Management | ✅ Create/Edit | ❌ | ✅ Monitor |
| Live Game | ✅ Host | ✅ Play | ✅ Monitor |
| Challenge | ✅ Create | ✅ Play | ✅ Monitor |
| Reporting | ✅ View own | ❌ | ✅ View all |

---

## 🎯 Actor Personas

### Giáo viên Ví dụ
**Name:** Cô Lan  
**Role:** Giáo viên Toán THCS  
**Goal:** Tạo bộ câu hỏi Bài 5, tổ chức kiểm tra trực tiếp với lớp 7A, rồi xem kết quả để đánh giá

**Journey:**
1. Đăng ký account với email school
2. Tạo Quiz "Bài 5 - Phương trình bậc nhất"
3. Thêm 20 câu hỏi trắc nghiệm
4. Host Live Game cho lớp 7A với 35 Học sinh
5. Monitor tiến độ trả lời real-time
6. Xem báo cáo phân tích sau phiên

---

### Học sinh Ví dụ
**Name:** Bạn Minh  
**Role:** Học sinh lớp 7A  
**Goal:** Tham gia kiểm tra Bài 5 với Cô Lan, cố gắng đạt điểm cao

**Journey:**
1. Nhận PIN từ Cô Lan (123456)
2. Truy cập ThinkTogether
3. Nhập PIN + Nickname "Minh123"
4. Tham gia Lobby chờ Cô Lan bắt đầu
5. Trả lời 20 câu hỏi trong phiên
6. Xem kết quả cá nhân & xếp hạng
7. Chia sẻ điểm lên Facebook

---

### Quản trị viên Ví dụ
**Name:** Anh Sơn  
**Role:** System Administrator  
**Goal:** Đảm bảo hệ thống hoạt động tốt, kiểm duyệt nội dung

**Journey:**
1. Đăng nhập Admin Dashboard
2. Monitor system metrics (CPU, Memory)
3. Review reported Quiz Sets
4. Ban user với nickname inappropriate
5. View daily analytics
6. Check audit logs

---

## 🔐 Permission Matrix

```
┌─────────────────────────────────────────────────────────────┐
│ Feature                 │ Giáo viên │ Học sinh │ Admin │ Guest │
├─────────────────────────────────────────────────────────────┤
│ Create Quiz             │    ✅     │    ❌    │  ✅   │  ❌   │
│ Edit Quiz (own)         │    ✅     │    ❌    │  ❌   │  ❌   │
│ Host Live Game          │    ✅     │    ❌    │  ❌   │  ❌   │
│ Join Live Game          │    ❌     │    ✅    │  ✅   │  ✅   │
│ Create Challenge        │    ✅     │    ❌    │  ❌   │  ❌   │
│ Join Challenge          │    ❌     │    ✅    │  ✅   │  ✅   │
│ View own Reports        │    ✅     │    ❌    │  ❌   │  ❌   │
│ View all Reports        │    ❌     │    ❌    │  ✅   │  ❌   │
│ Delete Quiz             │    ✅     │    ❌    │  ✅   │  ❌   │
│ Ban Users               │    ❌     │    ❌    │  ✅   │  ❌   │
│ System Config           │    ❌     │    ❌    │  ✅   │  ❌   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📌 Key Rules by Actor

### Giáo viên - Important Rules
1. **Only you can edit your quizzes** - Không ai ngoài bạn (và Admin) có thể edit
2. **Must have account** - Phải đăng ký & verify email
3. **Cannot play your own games** - Không thể join như Học sinh trong phiên của mình
4. **Pin timeout 30 mins** - PIN hết hiệu lực sau 30 phút

### Học sinh - Important Rules
1. **No account needed** - Không cần đăng ký, chỉ cần nickname
2. **Anonymous play** - Hoàn toàn ẩn danh, không lưu lịch sử
3. **One-time scores** - Mỗi lần chơi là một bản ghi riêng
4. **No content creation** - Chỉ được chơi, không được tạo content

### Quản trị viên - Important Rules
1. **Full system access** - Có thể xem/delete bất cứ dữ liệu nào
2. **Content moderation** - Kiểm duyệt quiz & comments không phù hợp
3. **User management** - Có thể ban/restore users
4. **Audit logging** - Tất cả hành động đều được log

---

## 🚀 Getting Started Guide by Actor Type

### For Giáo viên:
```
1. Go to https://thinktogether.com
2. Click "Đăng ký - Giáo viên"
3. Enter: Email, Password, Confirm Password
4. Verify email
5. Complete onboarding tour
6. Click "Create New Quiz"
7. Add questions
8. Click "Host Live Game"
9. Share PIN with students
10. Click "Start Game"
```

### For Học sinh:
```
1. Go to https://thinktogether.com
2. Enter PIN from teacher
3. Enter your Nickname
4. Click "Join"
5. Wait for game to start
6. Answer questions
7. View results & leaderboard
```

### For Quản trị viên:
```
1. Go to https://admin.thinktogether.com
2. Login with admin credentials
3. Choose dashboard option:
   - Analytics
   - User Management
   - Content Moderation
   - System Config
```

---

## ❓ FAQs by Actor

### Giáo viên
**Q: Tôi quên mật khẩu?**  
A: Click "Forgot Password" trên login page, verify email, set password mới.

**Q: Tôi có thể xóa quiz sau khi đã host?**  
A: Có, nhưng dữ liệu game vẫn được lưu để audit.

**Q: Tôi có thể chỉnh sửa quiz khi đang có Học sinh join?**  
A: Không, phải finish phiên trước.

---

### Học sinh
**Q: Tôi quên PIN?**  
A: Hỏi Giáo viên, hoặc check email/SMS nếu được share.

**Q: Nickname tôi bị từ chối vì "inappropriate"?**  
A: System filter profanity, chọn nickname khác.

**Q: Tôi có thể chơi Challenge nhiều lần?**  
A: Có, unlimited times, mỗi lần là score riêng.

---

### Quản trị viên
**Q: Làm sao để ban một user?**  
A: Admin Dashboard → User Management → Select user → Click "Ban".

**Q: Tôi có thể restore deleted data?**  
A: Có, system dùng soft delete, restore từ Archive.

---

## 📞 Support & Contact

- **For Giáo viên:** support@thinktogether.com (Priority)
- **For Học sinh:** help@thinktogether.com
- **For Quản trị viên:** admin-support@thinktogether.com

---

**Last Updated:** October 16, 2025  
**Next Review:** January 2026
