# Actors and Use Cases - ThinkTogether

**Document Version:** 1.0  
**Date:** 03/10/2025  
**Business Analyst:** Analysis based on PRD v1.0

---

## 1. ACTORS (Các tác nhân trong hệ thống)

### 1.1 Primary Actors (Tác nhân chính)

#### **1.1.1 Giáo viên (Teacher)** 
**Mô tả:** Các chuyên gia giáo dục có tài khoản đăng nhập, chịu trách nhiệm tạo và quản lý nội dung học tập, tổ chức các phiên học tập tương tác.

**Đặc điểm:**
- Phải đăng ký và đăng nhập để sử dụng hệ thống
- Có quyền sở hữu, tạo, chỉnh sửa, xóa các bộ câu hỏi (Quiz Sets)
- Có thể tổ chức phiên chơi trực tiếp (Live Game) với mã PIN
- Có thể tạo các "Thử thách" (Challenge) bất đồng bộ cho học sinh ôn tập
- Có quyền truy cập báo cáo chi tiết về kết quả học tập của học sinh
- Bao gồm: Giáo viên, giảng viên, trưởng nhóm lớp, quản lý đào tạo, người tổ chức sự kiện giáo dục

**Mục tiêu:**
- Tạo nội dung học tập chất lượng cao, phù hợp với chương trình giáo dục
- Tổ chức các phiên học tập tương tác hiệu quả, tăng sự tham gia của học sinh
- Theo dõi, đánh giá và phân tích kết quả học tập của học sinh
- Tái sử dụng, cải tiến và chia sẻ nội dung giáo dục

**Các quyền:**
- Tạo/Sửa/Xóa Quiz Sets
- Tạo/Sửa/Xóa Questions
- Host Live Game Sessions
- Tạo Challenge Links
- Xem báo cáo chi tiết
- Quản lý các phiên chơi (Kick players, pause, resume)
- Xuất dữ liệu báo cáo (CSV)

---

#### **1.1.2 Học sinh (Student)** 
**Mô tả:** Người học tham gia các phiên học tập tương tác do Giáo viên tổ chức, không cần đăng ký tài khoản.

**Đặc điểm:**
- Truy cập ẩn danh, chỉ cần nhập Nickname
- Tham gia Live Game thông qua mã PIN do Giáo viên cung cấp
- Tham gia Challenge bất đồng bộ thông qua link
- Có thể tham gia nhiều lần trong cùng một Challenge
- Bao gồm: Học sinh tiểu học/THCS/THPT, sinh viên, người học tự do

**Mục tiêu:**
- Tham gia học tập tương tác, nâng cao hiểu biết về kiến thức
- Trải nghiệm học tập vui vẻ, hấp dẫn thông qua game
- Cạnh tranh lành mạnh, động viên bản thân đạt điểm cao
- Ôn tập kiến thức thông qua Challenge Mode bất cứ lúc nào

**Các quyền:**
- Tham gia Live Game (với mã PIN)
- Tham gia Challenge (với link)
- Xem kết quả cá nhân sau mỗi phiên
- Xem bảng xếp hạng Challenge
- Tùy chỉnh âm thanh cá nhân
- Tham gia ẩn danh (không cần tài khoản)

---

### 1.2 Secondary Actors (Tác nhân phụ)

#### **1.2.1 Quản trị viên (Administrator)**
**Mô tả:** Người quản lý hệ thống ThinkTogether, có quyền cao nhất và trách nhiệm bảo trì nền tảng.

**Đặc điểm:**
- Có tài khoản với quyền hạn cao
- Có quyền truy cập toàn bộ hệ thống
- Không tạo nội dung nhưng quản lý nội dung hệ thống
- Bao gồm: Quản trị viên hệ thống, Technical Support, Content Moderator

**Mục tiêu:**
- Đảm bảo hệ thống hoạt động ổn định, an toàn
- Giám sát và duyệt nội dung không phù hợp
- Quản lý người dùng, xử lý các vấn đề vi phạm chính sách
- Duy trì chất lượng dữ liệu và hiệu suất hệ thống
- Thu thập thống kê hệ thống toàn cầu

**Các quyền:**
- Xem/Xóa bất kỳ Quiz Sets
- Xem/Xóa/Ban người dùng (Giáo viên, Học sinh)
- Duyệt nội dung (Profanity control, unsuitable content)
- Xem báo cáo hệ thống toàn cầu
- Quản lý cấu hình hệ thống
- Xem logs hệ thống, audit trails
- Xử lý bình luận khiếu nại từ người dùng

---

#### **1.2.2 Người dùng phổ thông (Guest/Anonymous User)**
**Mô tả:** Người truy cập trang chủ hoặc trang thông tin của hệ thống mà không yêu cầu đăng nhập.

**Đặc điểm:**
- Không cần tài khoản
- Chỉ truy cập được nội dung công khai
- Có thể trực tiếp tham gia Live Game hoặc Challenge nếu có mã PIN hoặc link
- Không thể tạo hoặc quản lý nội dung
- Bao gồm: Khách bè bạn, người tìm kiếm từ công cụ tìm kiếm, người dùng không xác thực

**Mục tiêu:**
- Khám phá nền tảng ThinkTogether
- Hiểu về các tính năng và lợi ích của hệ thống
- Tham gia một phiên chơi khi được mời (nếu có PIN/Link)

**Các quyền:**
- Xem trang chủ, trang giới thiệu
- Xem thông tin công khai về hệ thống
- Truy cập trang Sign Up / Login
- Tham gia Live Game (với PIN) hoặc Challenge (với Link) mà không cần tài khoản

---

#### **1.2.3 System/Server**
**Mô tả:** Hệ thống backend xử lý logic nghiệp vụ, quản lý trạng thái và dữ liệu.

**Trách nhiệm:**
- Quản lý trạng thái của các game sessions (Lobby, Playing, Finished)
- Tính toán điểm số theo các quy tắc định sẵn
- Xếp hạng real-time players dựa trên điểm số
- Đồng bộ dữ liệu real-time giữa Host và Players
- Lưu trữ và quản lý báo cáo kết quả các phiên chơi
- Kiểm soát Profanity Filter cho nickname
- Xác thực và ủy quyền người dùng
- Lưu trữ và backup dữ liệu định kỳ

---

#### **1.2.4 External Media Services**
**Mô tả:** Dịch vụ bên ngoài hỗ trợ upload, lưu trữ và quản lý media (hình ảnh, video).

**Trách nhiệm:**
- Lưu trữ ảnh bìa của Quiz Sets
- Lưu trữ ảnh/video trong Questions
- Validate định dạng file (MP4, WebM cho video; JPG, PNG cho ảnh)
- Validate kích thước file (limit 2MB cho ảnh, 50MB cho video)
- Streaming video content hiệu quả
- Tối ưu hóa ảnh cho hiển thị responsive trên nhiều thiết bị

---

## 1.3 ACTOR SUMMARY TABLE (Tóm tắt Actors)

| Aspect | Giáo viên | Học sinh | Quản trị viên | Người dùng phổ thông |
|--------|-----------|----------|---------------|----------------------|
| **Loại Actor** | Primary | Primary | Secondary | Secondary |
| **Yêu cầu Tài khoản** | ✓ Có | ✗ Không | ✓ Có | ✗ Không |
| **Tạo Content (Quiz)** | ✓ Có | ✗ Không | ✓ Quản lý | ✗ Không |
| **Host Live Game** | ✓ Có | ✗ Không | ✓ Monitor | ✗ Không |
| **Play/Tham gia Game** | ✗ Không (chỉ host) | ✓ Có | ✓ Có quyền | ✓ Có |
| **Tạo Challenge** | ✓ Có | ✗ Không | ✓ Quản lý | ✗ Không |
| **Play Challenge** | ✗ Không | ✓ Có | ✓ Có quyền | ✓ Có |
| **Xem Report** | ✓ Own data | ✗ Không | ✓ All data | ✗ Không |
| **Quản lý User** | ✗ Không | ✗ Không | ✓ Có | ✗ Không |
| **Primary Goal** | Tạo nội dung & Giáo dục | Học tập & Luyện tập | Quản lý & Bảo trì | Truy cập thông tin |
| **Ví dụ** | Giáo viên, Giảng viên | Học sinh, Sinh viên | Admin, Moderator | Khách bè bạn |

---

## 2. USE CASES (Các ca sử dụng)

### 2.1 Module: Authentication & User Management

#### **UC-AUTH-01: Đăng ký tài khoản Giáo viên**
**Actor:** Giáo viên (Primary)  
**Mô tả:** Giáo viên tạo tài khoản mới để sử dụng hệ thống tạo và quản lý nội dung học tập.

**Precondition:**
- Giáo viên chưa có tài khoản
- Truy cập trang Sign Up

**Main Flow:**
1. Giáo viên nhập email và password
2. System validate email (unique, format)
3. System validate password (≥8 ký tự, strength check)
4. System tạo account mới với vai trò "Teacher"
5. System tự động đăng nhập Giáo viên
6. System chuyển hướng đến onboarding flow cho Giáo viên

**Postcondition:**
- Account Giáo viên được tạo và authenticated
- Giáo viên có thể bắt đầu tạo Quiz Sets

**Alternative Flows:**
- A1: Email đã tồn tại → Hiển thị error message với gợi ý login
- A2: Password yếu → Hiển thị strength indicator và yêu cầu cải thiện

---

#### **UC-AUTH-02: Đăng nhập**
**Actor:** Giáo viên (Primary)  
**Mô tả:** Giáo viên đăng nhập vào hệ thống để truy cập các tính năng quản lý nội dung và tổ chức phiên học.

**Precondition:**
- Giáo viên đã có tài khoản
- Truy cập trang Login

**Main Flow:**
1. Giáo viên nhập email và password
2. System xác thực credentials
3. System tạo authentication token
4. System phân cấp quyền dựa trên vai trò "Teacher"
5. System chuyển hướng đến Dashboard của Giáo viên
6. System hiển thị welcome message

**Postcondition:**
- Giáo viên được authenticated
- Session được tạo và lưu trữ
- Giáo viên có quyền truy cập tất cả tính năng của Giáo viên

**Alternative Flows:**
- A1: Credentials sai → Hiển thị error message với gợi ý retry
- A2: Account không tồn tại → Gợi ý đăng ký

---

### 2.2 Module: Quiz Management

#### **UC-QUIZ-01: Xem danh sách Quiz Sets**
**Actor:** Giáo viên (Primary)  
**Mô tả:** Giáo viên xem tất cả bộ câu hỏi (Quiz Sets) của mình đã tạo

**Precondition:**
- Giáo viên đã đăng nhập

**Main Flow:**
1. Giáo viên truy cập "My Quizzes" dashboard
2. System load danh sách quiz sets của Giáo viên này
3. System hiển thị mỗi quiz dưới dạng card với:
   - Title, Cover Image
   - Số lượng câu hỏi
   - Ngày chỉnh sửa cuối
   - Quick actions (Edit, Host Live, Create Challenge, Delete, Duplicate)
4. Giáo viên có thể search/filter quiz sets theo tên hoặc ngày

**Postcondition:**
- Giáo viên thấy overview của tất cả quiz sets của mình

**Alternative Flows:**
- A1: Không có quiz nào → Hiển thị empty state với guidance tạo quiz đầu tiên
- A2: Quản trị viên xem → Hiển thị toàn bộ quiz sets của tất cả Giáo viên (với quyền Secondary)

---

#### **UC-QUIZ-02: Tạo Quiz Set mới**
**Actor:** Giáo viên (Primary), System (Secondary)  
**Mô tả:** Giáo viên tạo một bộ câu hỏi mới

**Precondition:**
- Giáo viên đã đăng nhập
- Đang ở Dashboard

**Main Flow:**
1. Giáo viên click "Create New Quiz"
2. System hiển thị wizard form
3. Giáo viên nhập:
   - Title (required) - tên bộ câu hỏi
   - Description (optional) - mô tả mục đích
   - Upload Cover Image (optional) - ảnh bìa
4. System validate input
5. System auto-save draft
6. Giáo viên click "Save"
7. System tạo quiz set mới với chủ sở hữu là Giáo viên hiện tại
8. System redirect đến "Edit Quiz" page để thêm câu hỏi

**Postcondition:**
- Quiz set mới được tạo và lưu vào database
- Giáo viên có thể bắt đầu thêm questions

**Alternative Flows:**
- A1: Title trống → Hiển thị validation error
- A2: Image sai format → Hiển thị error và format hỗ trợ (JPG, PNG)

---

#### **UC-QUIZ-03: Cập nhật Quiz Set**
**Actor:** Creator (Primary)  
**Mô tả:** Creator chỉnh sửa thông tin quiz set

**Precondition:**
- Creator đã đăng nhập
- Quiz set đã tồn tại

**Main Flow:**
1. Creator click "Edit" trên quiz card
2. System load quiz set data
3. Creator chỉnh sửa Title/Description/Image
4. Creator click "Save"
5. System validate và update
6. System hiển thị success message

**Postcondition:**
- Quiz set được cập nhật

---

#### **UC-QUIZ-04: Xóa Quiz Set**
**Actor:** Creator (Primary), System (Secondary)  
**Mô tả:** Creator xóa một quiz set và tất cả questions liên quan

**Precondition:**
- Creator đã đăng nhập
- Quiz set tồn tại

**Main Flow:**
1. Creator click "Delete" trên quiz card
2. System hiển thị confirmation modal
3. Creator confirm deletion
4. System xóa quiz set và tất cả questions
5. System cập nhật UI (remove card)
6. System hiển thị success message

**Postcondition:**
- Quiz set và associated data bị xóa vĩnh viễn

**Alternative Flows:**
- A1: Creator cancel → Không có gì thay đổi

---

#### **UC-QUIZ-05: Nhân bản Quiz Set**
**Actor:** Creator (Primary), System (Secondary)  
**Mô tả:** Creator tạo bản sao của quiz set để chỉnh sửa nhanh

**Precondition:**
- Creator đã đăng nhập
- Quiz set nguồn tồn tại

**Main Flow:**
1. Creator click "Duplicate" trên quiz card
2. System tạo deep copy của quiz set:
   - Title = Original Title + " - Copy"
   - Tất cả questions và settings
3. System hiển thị quiz mới trong dashboard
4. System hiển thị success message

**Postcondition:**
- Quiz set mới được tạo với nội dung giống hệt original

---

### 2.3 Module: Question Management

#### **UC-QUES-01: Xem danh sách Questions**
**Actor:** Creator (Primary)  
**Mô tả:** Creator xem tất cả câu hỏi trong một quiz set

**Precondition:**
- Creator đang ở "Edit Quiz" page

**Main Flow:**
1. System load tất cả questions của quiz
2. System hiển thị split-screen layout:
   - Left: Question list (với drag-drop)
   - Right: Question editor form
3. Mỗi question preview hiển thị:
   - Question type icon
   - Question content (truncated)
   - Time limit, Points
4. Creator có thể drag-drop để reorder

**Postcondition:**
- Creator có overview của quiz structure

**Alternative Flows:**
- A1: Không có questions → Hiển thị empty state với quick-add options

---

#### **UC-QUES-02: Tạo Question - Multiple Choice**
**Actor:** Creator (Primary), System (Secondary)  
**Mô tả:** Creator tạo câu hỏi trắc nghiệm

**Precondition:**
- Creator đang trong Quiz Editor

**Main Flow:**
1. Creator click "Add Question"
2. Creator chọn type "Multiple Choice"
3. Creator nhập:
   - Question content
   - Time limit (seconds)
   - Points
   - 2-6 answer options
   - Đánh dấu correct answer
   - Upload image (optional)
4. System validate:
   - Minimum 2 answers
   - Exactly 1 correct answer
5. System auto-save draft (every 30s)
6. Creator click "Save"
7. System lưu question

**Postcondition:**
- Question được thêm vào quiz set

**Alternative Flows:**
- A1: Ít hơn 2 answers → Validation error
- A2: Không có correct answer → Validation error

---

#### **UC-QUES-03: Tạo Question - True/False**
**Actor:** Creator (Primary)  
**Mô tả:** Creator tạo câu hỏi đúng/sai

**Main Flow:**
1. Creator click "Add Question"
2. Creator chọn type "True/False"
3. Creator nhập:
   - Question content
   - Time limit
   - Points
   - Toggle True/False as correct
   - Upload image (optional)
4. System lưu question

**Postcondition:**
- True/False question được tạo

---

#### **UC-QUES-04: Tạo Question - Matching**
**Actor:** Creator (Primary), System (Secondary)  
**Mô tả:** Creator tạo câu hỏi nối cặp

**Precondition:**
- Creator đang trong Quiz Editor

**Main Flow:**
1. Creator click "Add Question"
2. Creator chọn type "Matching"
3. Creator nhập:
   - Question content
   - Time limit, Points
   - 2-5 pairs (Left item - Right item)
4. System validate minimum 2 pairs
5. System lưu question với correct mappings

**Postcondition:**
- Matching question được tạo với pairs data

**Alternative Flows:**
- A1: Ít hơn 2 pairs → Validation error

---

#### **UC-QUES-05: Tạo Question - Ordering**
**Actor:** Creator (Primary), System (Secondary)  
**Mô tả:** Creator tạo câu hỏi sắp xếp

**Main Flow:**
1. Creator click "Add Question"
2. Creator chọn type "Ordering"
3. Creator nhập:
   - Question content
   - Time limit, Points
   - 3-6 items cần sắp xếp
   - Drag-drop để set correct order
4. System validate minimum 3 items
5. System lưu với correct sequence

**Postcondition:**
- Ordering question được tạo

---

#### **UC-QUES-06: Tạo Question - Video Question**
**Actor:** Creator (Primary), External Media Service (Secondary)  
**Mô tả:** Creator tạo câu hỏi kèm video với timestamp

**Precondition:**
- Creator đang trong Quiz Editor

**Main Flow:**
1. Creator click "Add Question"
2. Creator chọn type "Video Question"
3. Creator upload video file:
   - System validate format (MP4, WebM)
   - System validate duration (max 2 minutes)
4. System hiển thị video preview player
5. Creator nhập:
   - Question content
   - Time limit, Points
   - Chọn timestamp để hiển thị question
   - Answers (Multiple Choice format)
6. System lưu video và question metadata

**Postcondition:**
- Video question được tạo với timestamp setting

**Alternative Flows:**
- A1: Video > 2 minutes → Reject với error message
- A2: Unsupported format → Show supported formats

---

#### **UC-QUES-07: Cập nhật Question**
**Actor:** Creator (Primary)  
**Mô tả:** Creator chỉnh sửa câu hỏi đã tồn tại

**Precondition:**
- Question đã tồn tại trong quiz

**Main Flow:**
1. Creator click vào question trong list
2. System load question details vào editor
3. Creator chỉnh sửa bất kỳ field nào
4. System auto-save draft
5. Creator click "Save"
6. System update question
7. System update preview trong list

**Postcondition:**
- Question được cập nhật

---

#### **UC-QUES-08: Xóa Question**
**Actor:** Creator (Primary)  
**Mô tả:** Creator xóa một câu hỏi khỏi quiz

**Main Flow:**
1. Creator click delete icon trên question
2. System hiển thị confirmation prompt
3. Creator confirm
4. System xóa question
5. System cập nhật question list

**Postcondition:**
- Question bị xóa khỏi quiz set

---

#### **UC-QUES-09: Sắp xếp lại thứ tự Questions**
**Actor:** Creator (Primary)  
**Mô tả:** Creator thay đổi thứ tự câu hỏi trong quiz

**Main Flow:**
1. Creator drag một question trong list
2. Creator drop vào vị trí mới
3. System auto-save order mới
4. System hiển thị success indicator

**Postcondition:**
- Question order được cập nhật

---

### 2.4 Module: Live Game - Setup & Configuration

#### **UC-LIVE-01: Cấu hình Game Settings**
**Actor:** Creator/Host (Primary)  
**Mô tả:** Host cấu hình settings trước khi tạo game session

**Precondition:**
- Host đã đăng nhập
- Quiz set có ít nhất 1 question

**Main Flow:**
1. Host click "Host Live Game" trên quiz card
2. System hiển thị Settings Modal
3. Host cấu hình:
   - **Number of Questions:** Chọn số câu hỏi (1 đến tổng số)
   - **Question Order:** "In Order" hoặc "Shuffle"
   - **Background Music:** Toggle On/Off
   - **Show Leaderboard:** Toggle On/Off (sau mỗi câu)
   - **Time-based Scoring:** Toggle On/Off
4. Host click "Create Game"
5. System validate settings
6. System tạo game session với settings
7. System chuyển đến Lobby

**Postcondition:**
- Game session được tạo với custom settings
- Settings được lưu và apply cho session

**Alternative Flows:**
- A1: Số câu hỏi invalid → Validation error
- A2: Host cancel → Quay về dashboard

---

#### **UC-LIVE-02: Tạo và Quản lý Lobby**
**Actor:** Giáo viên (Host) (Primary), System (Secondary)  
**Mô tả:** Giáo viên (đóng vai trò Host) tạo phòng chờ (Lobby) và chờ Học sinh tham gia

**Precondition:**
- Giáo viên đã configure game settings

**Main Flow:**
1. System generate unique 6-digit PIN
2. System validate PIN không trùng với active sessions
3. System hiển thị Lobby screen (Host view) với:
   - PIN (prominent display)
   - Copy-to-clipboard button
   - QR code có thể scan
   - Share buttons (copy link, share to social)
   - Countdown timer (30 minutes)
4. System hiển thị real-time danh sách Học sinh đã tham gia
5. Giáo viên (Host) có thể:
   - Kick Học sinh nếu cần
   - Wait for more students
   - Start game khi sẵn sàng

**Postcondition:**
- Lobby active và sẵn sàng nhận Học sinh
- PIN có hiệu lực trong 30 phút

**Alternative Flows:**
- A1: PIN conflict → System regenerate PIN
- A2: 30 minutes timeout → Session expired, Host cần tạo session mới

---

#### **UC-LIVE-03: Học sinh tham gia Lobby**
**Actor:** Học sinh (Primary), System (Secondary)  
**Mô tả:** Học sinh tham gia phiên chơi trực tiếp bằng mã PIN do Giáo viên cung cấp

**Precondition:**
- Game session active (Giáo viên đã tạo Lobby)
- Học sinh có mã PIN
- Học sinh truy cập trang home hoặc mở ứng dụng

**Main Flow:**
1. Học sinh nhập:
   - Game PIN (6 digits)
   - Nickname (tên hiển thị trong phiên)
2. System validate:
   - PIN tồn tại và active
   - Nickname unique trong session (không trùng với Học sinh khác)
   - Nickname pass profanity filter (không chứa từ cấu)
3. System add Học sinh vào lobby
4. System broadcast update đến Giáo viên (Host) và tất cả Học sinh khác
5. Học sinh nhận được "Waiting for game to start" screen
6. Học sinh có thể thấy bảng xếp hạng tạm thời nếu Giáo viên bật tùy chọn này

**Postcondition:**
- Học sinh successfully joined lobby
- Giáo viên thấy Học sinh trong player list
- Học sinh sẵn sàng chơi

**Alternative Flows:**
- A1: Invalid PIN → Error message "Mã PIN không hợp lệ hoặc phiên đã kết thúc"
- A2: Nickname taken → Gợi ý nickname khác hoặc thêm số
- A3: Profanity detected → Reject với message "Nickname không phù hợp, vui lòng chọn tên khác"
- A4: Học sinh kicked by Host → Disconnect với notification "Bạn đã bị loại khỏi phiên này"

---

#### **UC-LIVE-04: Giáo viên Kick Học sinh**
**Actor:** Giáo viên (Host) (Primary)  
**Mô tả:** Giáo viên xóa một Học sinh khỏi lobby nếu hành vi không phù hợp

**Precondition:**
- Học sinh đang trong lobby
- Giáo viên có quyền Host

**Main Flow:**
1. Giáo viên click "Kick" button bên cạnh tên Học sinh
2. System remove Học sinh khỏi session
3. System send disconnect event đến Học sinh
4. Học sinh nhận message "Bạn đã bị loại khỏi phiên này"
5. Học sinh được redirect về trang home
6. System update lobby UI cho Giáo viên và remaining Học sinh

**Postcondition:**
- Học sinh bị disconnect
- Lobby list được cập nhật
- Học sinh không thể tham gia lại phiên này

---

### 2.5 Module: Live Game - Gameplay

#### **UC-LIVE-05: Bắt đầu Game**
**Actor:** Giáo viên (Host) (Primary), System (Secondary)  
**Mô tả:** Giáo viên khởi động phiên chơi từ lobby

**Precondition:**
- Lobby có ít nhất 1 Học sinh
- Giáo viên sẵn sàng bắt đầu

**Main Flow:**
1. Giáo viên click "Start Game" button
2. System validate:
   - Minimum 1 học sinh trong lobby
   - Quiz có ít nhất 1 câu hỏi
3. System update game state = "PLAYING"
4. System apply game settings (shuffle if enabled)
5. System broadcast "Game Starting" event
6. System transition tất cả clients (Host + Học sinh) đến game interface
7. System load first question

**Postcondition:**
- Game state = PLAYING
- Tất cả Học sinh sẵn sàng trả lời câu hỏi đầu tiên

**Alternative Flows:**
- A1: No students → Button disabled với tooltip "Cần có ít nhất 1 học sinh để bắt đầu"
- A2: Network error → Retry mechanism, show error message

---

#### **UC-LIVE-06: Hiển thị Question**
**Actor:** Giáo viên (Host) (Primary), System (Secondary), Học sinh (Primary)  
**Mô tả:** System hiển thị câu hỏi đến tất cả participants (Giáo viên và Học sinh)

**Precondition:**
- Game đang PLAYING
- Có question tiếp theo

**Main Flow:**
1. System load question data
2. System broadcast question event:
   - Question content
   - Time limit
   - Question type
   - Media (if any)
3. **Giáo viên (Host) screen hiển thị:**
   - Full question với tất cả đáp án
   - Timer countdown
   - Real-time indicator: số Học sinh đã trả lời / tổng số
4. **Học sinh screen hiển thị:**
   - Question content
   - Answer buttons/interface (tùy loại câu hỏi)
   - Timer countdown
   - Trạng thái: "Chờ câu trả lời..." hoặc "Đã trả lời"
5. System start timer
6. System enable answer submission cho Học sinh

**Postcondition:**
- Question đang active
- Học sinh có thể submit answers
- Giáo viên có thể monitor tiến độ

---

#### **UC-LIVE-07: Học sinh Submit Answer**
**Actor:** Học sinh (Primary), System (Secondary)  
**Mô tả:** Học sinh trả lời câu hỏi trong thời gian quy định

**Precondition:**
- Question đang active
- Học sinh chưa submit answer

**Main Flow:**
1. Học sinh chọn answer (click button/drag items/etc tùy loại câu hỏi)
2. Học sinh confirm selection
3. System timestamp submission
4. System send answer + timestamp đến server
5. Server validate:
   - Within time limit
   - Valid answer format
6. Server calculate score:
   - Đáp án đúng → Full points
   - Đáp án sai → 0 points
   - Time bonus (if enabled) = Points * (time_remaining / time_limit)
7. Server save result
8. System disable submission UI cho Học sinh
9. System hiển thị "Chờ kết quả..." hoặc "Đã trả lời, chờ Giáo viên tiếp tục..."

**Postcondition:**
- Học sinh answer được lưu
- Score được tính

**Alternative Flows:**
- A1: Timeout → Học sinh nhận 0 points, System hiển thị "Hết giờ"
- A2: Network error → Auto-retry mechanism, show error message

---

#### **UC-LIVE-08: Hiển thị Question Results**
**Actor:** Giáo viên (Host) (Primary), System (Secondary), Học sinh (Primary)  
**Mô tả:** Hiển thị kết quả câu hỏi sau khi hết giờ hoặc tất cả Học sinh đã trả lời

**Precondition:**
- Timer expired hoặc tất cả Học sinh submitted

**Main Flow:**
1. System process tất cả submissions
2. System calculate:
   - Đáp án đúng (đáp án nào được chọn nhiều nhất)
   - Tỷ lệ Học sinh chọn từng đáp án
   - Top 5 bảng xếp hạng update
3. **Giáo viên (Host) screen hiển thị:**
   - Đáp án đúng (highlighted bằng màu xanh)
   - Answer distribution (% Học sinh chọn mỗi đáp án)
   - Top 5 bảng xếp hạng (nếu tùy chọn bật)
   - Số Học sinh trả lời đúng/sai
4. **Học sinh screen hiển thị:**
   - Đáp án của mình (tick xanh nếu đúng, x đỏ nếu sai)
   - Đáp án đúng
   - Điểm kiếm được từ câu này
   - Ranking hiện tại của mình
5. Giáo viên có button "Next Question"

**Postcondition:**
- Results displayed
- Ready for next question hoặc kết thúc

**Alternative Flows:**
- A1: Đây là last question → Trigger UC-LIVE-10 (Final Results)

---

#### **UC-LIVE-09: Chuyển sang Question tiếp theo**
**Actor:** Giáo viên (Host) (Primary), System (Secondary)  
**Mô tả:** Giáo viên trigger câu hỏi tiếp theo hoặc kết thúc phiên

**Precondition:**
- Results đã hiển thị
- Còn questions

**Main Flow:**
1. Giáo viên click "Next Question"
2. System increment question index
3. System trigger UC-LIVE-06 (Hiển thị Question)

**Postcondition:**
- Next question được load và hiển thị

**Alternative Flows:**
- A1: Đây là last question → Trigger UC-LIVE-10 (Final Results & Podium)

---

#### **UC-LIVE-10: Hiển thị Final Results & Podium**
**Actor:** Giáo viên (Host) (Primary), System (Secondary), Học sinh (Primary)  
**Mô tả:** Hiển thị kết quả cuối cùng và bảng xếp hạng với hiệu ứng podium

**Precondition:**
- Tất cả questions đã hoàn thành

**Main Flow:**
1. System finalize all scores
2. System sort final leaderboard (cao nhất đầu)
3. System update game state = "FINISHED"
4. **Cả Giáo viên & Học sinh screens hiển thị:**
   - **Podium animation** với Top 3:
     - 1st place (vàng) - center, highest
     - 2nd place (bạc) - left
     - 3rd place (đồng) - right
     - Hiệu ứng confetti/animation
   - Tên và điểm của top 3 Học sinh
   - **Full leaderboard** (scrollable/paginated):
     - Rank, Nickname, Total Score, +/- so với xếp hạng trước
   - **Game statistics:**
     - Total players
     - Average score
     - Highest score
     - Lowest score
5. Giáo viên (Host) có options:
   - View detailed report
   - Host again (tạo phiên mới)
   - Back to dashboard
6. Học sinh có options:
   - Share result
   - Play again (nếu có Challenge mode)
   - Back to home

**Postcondition:**
- Game session completed
- Results saved for reporting
- Data lưu vào database

**Alternative Flows:**
- A1: Kết nối mất → Auto-save results đã có, Học sinh/Giáo viên có thể xem lại

---

#### **UC-LIVE-11: Reconnection Handling**
**Actor:** Giáo viên (Host) / Học sinh (Primary), System (Secondary)  
**Mô tả:** Xử lý tình huống mất kết nối khi Giáo viên hoặc Học sinh đang chơi

**Precondition:**
- Connection lost during game
- Session still active (trong 5 phút)

**Main Flow:**
1. Giáo viên/Học sinh mất connection
2. System detect disconnect
3. Giáo viên/Học sinh re-open page hoặc reconnect
4. System identify session via token/cookie
5. System restore:
   - Current game state
   - Player/Host's current score
   - Current question (nếu active)
   - Leaderboard status
6. System seamlessly resume game
7. System hiển thị notification "Đã kết nối lại"

**Postcondition:**
- Giáo viên/Học sinh reconnected
- Game continues smoothly
- Không mất dữ liệu

**Alternative Flows:**
- A1: Session expired (>5 minutes) → Show "Phiên chơi đã kết thúc" message
- A2: Quiz đã hoàn thành → Show final results

---

### 2.6 Module: Challenge Mode

#### **UC-CHAL-01: Tạo Challenge Link**
**Actor:** Giáo viên (Primary), System (Secondary)  
**Mô tả:** Giáo viên tạo link "Thử thách" bất đồng bộ để Học sinh ôn tập hoặc luyện tập

**Precondition:**
- Giáo viên đã đăng nhập
- Quiz set tồn tại

**Main Flow:**
1. Giáo viên click "Create Challenge" trên quiz card
2. System generate unique, shareable URL (VD: thinktogether.com/challenge/abc123)
3. System create Challenge record:
   - Link to quiz set
   - Unique ID
   - Created date
   - Persistent leaderboard (lưu lại tất cả kết quả)
   - Creator = Giáo viên hiện tại
4. System hiển thị Challenge URL
5. System hiển thị "Copy Link" button
6. Giáo viên có thể share link:
   - Copy & paste
   - QR code
   - Share to social/messaging

**Postcondition:**
- Challenge link active
- Bất cứ ai có link đều có thể play
- Leaderboard persistent và cumulative

---

#### **UC-CHAL-02: Học sinh Join Challenge**
**Actor:** Học sinh (Primary), System (Secondary)  
**Mô tả:** Học sinh tham gia thử thách bất đồng bộ qua link mà không cần tài khoản

**Precondition:**
- Học sinh có challenge link
- Challenge còn active (Giáo viên chưa xóa)

**Main Flow:**
1. Học sinh click vào challenge link
2. System load challenge page
3. System prompt nhập Nickname
4. Học sinh nhập nickname
5. System validate nickname (profanity filter)
6. System create player session cho challenge này
7. System load quiz questions
8. System start challenge mode (solo play)

**Postcondition:**
- Học sinh bắt đầu solo play session
- Không ảnh hưởng đến Học sinh khác

---

#### **UC-CHAL-03: Học sinh Complete Challenge**
**Actor:** Học sinh (Primary), System (Secondary)  
**Mô tả:** Học sinh hoàn thành thử thách và xem kết quả cá nhân và bảng xếp hạng

**Precondition:**
- Học sinh đang play challenge
- All questions answered

**Main Flow:**
1. Học sinh submit answer cuối cùng
2. System calculate final score
3. System save score vào Challenge leaderboard
4. System hiển thị:
   - Học sinh's final score
   - Rank trên Challenge leaderboard (VD: #5 trong 47 người chơi)
   - Full persistent leaderboard (top 50, scrollable)
5. Học sinh có options:
   - Play again (chơi lại để cố gắng xếp hạng cao hơn)
   - Share result (chia sẻ điểm lên social)
   - Back to home

**Postcondition:**
- Score saved to Challenge leaderboard
- Leaderboard updated
- Học sinh có thể chơi lại nhiều lần

---

#### **UC-CHAL-04: View Challenge Leaderboard**
**Actor:** Học sinh (Primary), Giáo viên (Primary)  
**Mô tả:** Xem bảng xếp hạng persistent của một Challenge

**Precondition:**
- Challenge có ít nhất 1 completion

**Main Flow:**
1. User (Học sinh hoặc Giáo viên) truy cập challenge link hoặc leaderboard tab
2. System load tất cả scores cho challenge đó (sort by score, highest first)
3. System hiển thị:
   - **Rank:** Vị trí (#1, #2, ...)
   - **Nickname:** Tên người chơi
   - **Score:** Điểm tổng
   - **Date:** Ngày chơi
   - **Trend:** Mũi tên lên/xuống nếu so sánh với lần chơi trước
4. Pagination/Load more để xem hạng thấp hơn
5. User có thể sort by score hoặc date

**Postcondition:**
- Leaderboard displayed
- Stimulate Học sinh cạnh tranh và chơi lại

---

### 2.7 Module: Player Experience

#### **UC-PLAYER-01: Toggle Audio Settings**
**Actor:** Player (Primary)  
**Mô tả:** Player bật/tắt tất cả âm thanh

**Precondition:**
- Player đang trong game (Live hoặc Challenge)

**Main Flow:**
1. Player click sound icon trên screen
2. System toggle audio state
3. System mute/unmute:
   - Background music
   - Sound effects
4. System save preference cho session
5. System hiển thị visual indicator

**Postcondition:**
- Audio state updated
- Preference persist across screens trong session

---

### 2.8 Module: Reporting & Analytics

#### **UC-REPORT-01: View Past Game Sessions**
**Actor:** Giáo viên (Primary)  
**Mô tả:** Giáo viên xem danh sách các phiên chơi trực tiếp đã kết thúc

**Precondition:**
- Giáo viên đã đăng nhập
- Có ít nhất 1 completed Live Game

**Main Flow:**
1. Giáo viên navigate đến "Reports" page
2. System load tất cả completed Live Game sessions do Giáo viên này host
3. System hiển thị list:
   - Quiz title
   - Date & Time (khi phiên kết thúc)
   - Number of participants (Học sinh)
   - Average score
   - Highest score
   - Lowest score
4. List sorted by date (most recent first)
5. Giáo viên có thể:
   - Search by quiz name
   - Filter by date range
   - Click một phiên để xem chi tiết (UC-REPORT-02)

**Postcondition:**
- Session list displayed
- Ready for detailed analysis

---

#### **UC-REPORT-02: View Detailed Game Report**
**Actor:** Giáo viên (Primary)  
**Mô tả:** Giáo viên xem báo cáo chi tiết và phân tích của một phiên chơi

**Precondition:**
- Game session đã completed

**Main Flow:**
1. Giáo viên click vào một session trong list
2. System load detailed report
3. **Report bao gồm:**
   - **Section 1: Overview**
     - Quiz title & description
     - Game settings used (shuffle, time-based scoring, etc.)
     - Total participants
     - Average score
     - Highest & lowest score
     - Duration (bắt đầu - kết thúc)
   
   - **Section 2: Full Leaderboard** (paginated, 10 per page)
     - Rank, Nickname, Total Score
     - Navigation controls (Previous/Next page)
     - Search by nickname
   
   - **Section 3: Per-Question Analysis**
     - For each question:
       - Question content (text/image)
       - Question type icon
       - Bar chart: % Học sinh chọn từng đáp án
       - Correct answer highlighted (green)
       - Incorrect answers (red)
       - Average response time
       - Number of correct answers
       - Difficulty level indicator

4. Giáo viên có options:
   - Export to CSV
   - Print report
   - Download as PDF

**Postcondition:**
- Full detailed report displayed
- Ready for analysis and decision-making

---

#### **UC-REPORT-03: Export Report to CSV**
**Actor:** Giáo viên (Primary), System (Secondary)  
**Mô tả:** Giáo viên xuất báo cáo ra file CSV để phân tích thêm

**Precondition:**
- Giáo viên đang xem detailed report

**Main Flow:**
1. Giáo viên click "Export to CSV" button
2. System generate CSV file với columns:
   - Rank
   - Nickname
   - Total Score
   - Scores per question
   - Submission time for each question
   - Correct/Incorrect indicator per question
3. System trigger download
4. File saved to user's device (filename: QuizName_Date.csv)
5. System hiển thị success message

**Postcondition:**
- CSV file downloaded
- Giáo viên có thể mở trong Excel/Google Sheets để phân tích

**Alternative Flows:**
- A1: Generate error → Show error message "Không thể export, vui lòng thử lại"

---

### 2.9 Module: User Experience Enhancements

#### **UC-UX-01: Onboarding Tour for New Teachers**
**Actor:** Giáo viên (Primary), System (Secondary)  
**Mô tả:** Hướng dẫn Giáo viên mới sử dụng hệ thống qua interactive tour

**Precondition:**
- Giáo viên vừa đăng ký lần đầu
- Chưa complete onboarding

**Main Flow:**
1. Giáo viên login lần đầu
2. System detect first-time user
3. System trigger interactive tour
4. Tour highlights các tính năng chính:
   - Dashboard overview
   - "Create Quiz" button & flow
   - Quiz editor basics
   - "Host Game" feature
   - "Create Challenge" feature
   - "Reports" section
5. Each step có:
   - Tooltip with explanation (bằng tiếng Việt)
   - Highlight element (blur background)
   - "Next" / "Skip Tour" buttons
   - Progress indicator (Step 1/6, etc.)
6. Giáo viên có thể skip tour bất cứ lúc nào
7. System mark onboarding complete

**Postcondition:**
- Giáo viên familiar với key features
- Onboarding flag updated
- Có thể access full features

---

#### **UC-UX-02: Keyboard Navigation**
**Actor:** Giáo viên / Học sinh (Primary)  
**Mô tả:** Users navigate toàn bộ hệ thống bằng keyboard

**Precondition:**
- User đang sử dụng hệ thống

**Main Flow:**
1. User press **Tab** → Highlight next interactive element (button, input, link)
2. User press **Shift+Tab** → Highlight previous interactive element
3. User press **Arrow keys** → Navigate lists/menus/tables
4. User press **Enter** → Activate focused element
5. User press **Space** → Toggle/select checkbox, button
6. User press **Escape** → Close modals/dropdowns
7. System hiển thị **visible focus indicators** (outline, highlight)
8. Screen reader announces element được focus (ARIA labels)

**Supported Keyboard Shortcuts:**
- **Ctrl+S** → Save (trong Quiz Editor)
- **Ctrl+Z** → Undo (trong Quiz Editor)
- **Ctrl+Y** → Redo (trong Quiz Editor)
- **?** → Show keyboard shortcuts help

**Postcondition:**
- Full keyboard accessibility
- WCAG 2.1 Level AA compliance
- Users with mobility issues can use fully

---

## 3. USE CASE DIAGRAM STRUCTURE

```
┌─────────────────────────────────────────────────────────────┐
│                     THINKTOGETHER SYSTEM                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AUTHENTICATION & USER MANAGEMENT                     │  │
│  │  - UC-AUTH-01: Register Creator Account              │  │
│  │  - UC-AUTH-02: Login                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CONTENT MANAGEMENT (Quiz & Questions)               │  │
│  │  - UC-QUIZ-01: View Quiz Sets                        │  │
│  │  - UC-QUIZ-02: Create Quiz Set                       │  │
│  │  - UC-QUIZ-03: Update Quiz Set                       │  │
│  │  - UC-QUIZ-04: Delete Quiz Set                       │  │
│  │  - UC-QUIZ-05: Duplicate Quiz Set                    │  │
│  │  - UC-QUES-01: View Questions                        │  │
│  │  - UC-QUES-02: Create Multiple Choice Question       │  │
│  │  - UC-QUES-03: Create True/False Question            │  │
│  │  - UC-QUES-04: Create Matching Question              │  │
│  │  - UC-QUES-05: Create Ordering Question              │  │
│  │  - UC-QUES-06: Create Video Question                 │  │
│  │  - UC-QUES-07: Update Question                       │  │
│  │  - UC-QUES-08: Delete Question                       │  │
│  │  - UC-QUES-09: Reorder Questions                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  LIVE GAME MODE                                       │  │
│  │  - UC-LIVE-01: Configure Game Settings               │  │
│  │  - UC-LIVE-02: Create & Manage Lobby                 │  │
│  │  - UC-LIVE-03: Player Join Lobby                     │  │
│  │  - UC-LIVE-04: Host Kick Player                      │  │
│  │  - UC-LIVE-05: Start Game                            │  │
│  │  - UC-LIVE-06: Display Question                      │  │
│  │  - UC-LIVE-07: Player Submit Answer                  │  │
│  │  - UC-LIVE-08: Display Question Results              │  │
│  │  - UC-LIVE-09: Next Question                         │  │
│  │  - UC-LIVE-10: Display Final Results                 │  │
│  │  - UC-LIVE-11: Reconnection Handling                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CHALLENGE MODE                                       │  │
│  │  - UC-CHAL-01: Create Challenge Link                 │  │
│  │  - UC-CHAL-02: Player Join Challenge                 │  │
│  │  - UC-CHAL-03: Player Complete Challenge             │  │
│  │  - UC-CHAL-04: View Challenge Leaderboard            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PLAYER EXPERIENCE                                    │  │
│  │  - UC-PLAYER-01: Toggle Audio Settings               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  REPORTING & ANALYTICS                                │  │
│  │  - UC-REPORT-01: View Past Game Sessions             │  │
│  │  - UC-REPORT-02: View Detailed Game Report           │  │
│  │  - UC-REPORT-03: Export Report to CSV                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UX ENHANCEMENTS                                      │  │
│  │  - UC-UX-01: Onboarding Tour                         │  │
│  │  - UC-UX-02: Keyboard Navigation                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 4. ACTOR-USE CASE MATRIX

| Use Case | Giáo viên | Học sinh | Quản trị viên | Người dùng phổ thông | System | External Media |
|----------|-----------|----------|---------------|----------------------|--------|----------------|
| **Authentication & User Management** |
| UC-AUTH-01 | Primary | - | - | - | Secondary | - |
| UC-AUTH-02 | Primary | - | - | - | Secondary | - |
| **Content Management** |
| UC-QUIZ-01 to UC-QUIZ-05 | Primary | - | Secondary (view all) | - | Secondary | - |
| UC-QUES-01 to UC-QUES-09 | Primary | - | Secondary (view all) | - | Secondary | - |
| UC-QUES-06 (Video) | Primary | - | Secondary | - | Secondary | Secondary |
| **Live Game Mode** |
| UC-LIVE-01, 02, 04, 05, 09 | Primary (Host) | - | Secondary (monitor) | - | Secondary | - |
| UC-LIVE-03 | - | Primary | Secondary (monitor) | Primary (Guest) | Secondary | - |
| UC-LIVE-06 to UC-LIVE-08 | Primary | Primary | Secondary | Primary | Secondary | - |
| UC-LIVE-10 | Primary | Primary | Secondary | Primary | Secondary | - |
| UC-LIVE-11 | Primary | Primary | Secondary | Primary | Secondary | - |
| **Challenge Mode** |
| UC-CHAL-01 | Primary | - | Secondary | - | Secondary | - |
| UC-CHAL-02 to UC-CHAL-04 | - | Primary | Secondary | Primary (Guest) | Secondary | - |
| **Player Experience** |
| UC-PLAYER-01 | - | Primary | - | Primary | - | - |
| **Reporting** |
| UC-REPORT-01 to UC-REPORT-03 | Primary | - | Secondary (full access) | - | Secondary | - |
| **UX Enhancements** |
| UC-UX-01 | Primary | - | - | - | Secondary | - |
| UC-UX-02 | Primary | Primary | - | Primary | - | - |

**Legend:**
- **Primary:** Actor chính chịu trách nhiệm sử dụng/khởi động use case này
- **Secondary:** Actor phụ tham gia hoặc hỗ trợ trong use case
- **-:** Actor không liên quan

## 5. USE CASE DEPENDENCIES & RELATIONSHIPS

### 5.1 Include Relationships (<<include>>)
- **UC-LIVE-06** (Display Question) `includes` validation logic
- **UC-LIVE-07** (Submit Answer) `includes` score calculation
- **UC-QUES-02 to UC-QUES-06** `include` media upload validation

### 5.2 Extend Relationships (<<extend>>)
- **UC-QUES-06** (Video Question) `extends` UC-QUES-02 (Multiple Choice)
- **UC-LIVE-11** (Reconnection) `extends` UC-LIVE-07 (Submit Answer)
- **UC-REPORT-03** (Export CSV) `extends` UC-REPORT-02 (View Report)

### 5.3 Generalization
- UC-QUES-02, 03, 04, 05, 06 are specializations of "Create Question"
- UC-AUTH-01, 02 are specializations of "Authentication"

## 6. BUSINESS RULES

### 6.1 Quiz Management Rules (Giáo viên)
- **BR-01:** Một Giáo viên chỉ có thể chỉnh sửa/xóa quiz sets của chính mình (trừ Quản trị viên)
- **BR-02:** Một quiz set phải có ít nhất 1 question để có thể host Live Game
- **BR-03:** Title của quiz set là required field
- **BR-04:** Khi xóa quiz set, tất cả questions và game history liên quan cũng bị xóa (soft delete để audit)
- **BR-05:** Quản trị viên có thể xem/quản lý tất cả quiz sets của tất cả Giáo viên

### 6.2 Question Rules
- **BR-06:** Multiple Choice: minimum 2 answers, maximum 6, exactly 1 correct
- **BR-07:** Matching: minimum 2 pairs, maximum 5
- **BR-08:** Ordering: minimum 3 items, maximum 6
- **BR-09:** Video Question: maximum 2 minutes duration, supported formats: MP4, WebM
- **BR-10:** Time limit must be > 0 and <= 300 seconds
- **BR-11:** Points must be >= 0 and <= 1000

### 6.3 Live Game Rules (Giáo viên host, Học sinh play)
- **BR-12:** Game PIN phải unique trong tất cả active sessions (TTL: 30 minutes)
- **BR-13:** Lobby timeout sau 30 minutes nếu Giáo viên không start
- **BR-14:** Nickname phải unique trong một game session
- **BR-15:** Giáo viên (Host) có quyền tuyệt đối kick Học sinh trong lobby
- **BR-16:** Minimum 1 Học sinh để start game
- **BR-17:** Giáo viên không thể tham gia như Học sinh trong chính phiên của mình

### 6.4 Scoring Rules (Học sinh)
- **BR-18:** Correct answer = configured points
- **BR-19:** Incorrect answer = 0 points
- **BR-20:** Time-based scoring: Points * (time_remaining / time_limit) nếu tùy chọn enable
- **BR-21:** No answer = 0 points
- **BR-22:** Học sinh không thể see Giáo viên's detailed scoring configuration

### 6.5 Challenge Mode Rules (Học sinh)
- **BR-23:** Challenge link là persistent và không expire (cho đến khi Giáo viên delete)
- **BR-24:** Một Học sinh có thể play cùng challenge nhiều lần
- **BR-25:** Mỗi lần play được lưu riêng trong persistent leaderboard
- **BR-26:** Leaderboard là public (ai có link đều thấy)

### 6.6 Data & Security Rules
- **BR-27:** Email phải unique trong hệ thống (case-insensitive)
- **BR-28:** Password minimum 8 characters, recommend mix of letters/numbers
- **BR-29:** Profanity filter apply cho tất cả nicknames trong Live Game & Challenge
- **BR-30:** Học sinh không cần authentication để join Live Game/Challenge
- **BR-31:** Giáo viên data không thể xóa nếu có active games
- **BR-32:** Quản trị viên có thể soft-delete/restore dữ liệu

### 6.7 Reporting & Analytics Rules (Giáo viên)
- **BR-33:** Giáo viên chỉ có thể xem report của quiz sets của mình
- **BR-34:** Quản trị viên có thể xem report của tất cả games
- **BR-35:** Report data không thể modify sau khi game finished
- **BR-36:** Học sinh không thể xem chi tiết từng câu hỏi của Giáo viên khác

### 6.8 Permission Rules (Quyền hạn)

#### Giáo viên Permissions:
- Create/Edit/Delete own Quiz Sets ✓
- Create Challenge Links ✓
- Host Live Games ✓
- View own Reports & Analytics ✓
- Export data to CSV ✓
- View Challenge Leaderboards của mình ✓
- Delete own account (soft-delete) ✓

#### Học sinh Permissions:
- Join Live Game (với PIN) ✓
- Join Challenge (với Link) ✓
- View own scores & leaderboard ranking ✓
- Toggle audio settings ✓
- Cannot create/edit content ✗
- Cannot view Giáo viên's dashboard ✗
- Cannot access reports ✗

#### Quản trị viên Permissions:
- View/Delete all Quiz Sets ✓
- View/Ban/Delete Giáo viên & Học sinh ✓
- View all Games & Reports ✓
- Monitor Profanity & Inappropriate Content ✓
- System Configuration & Maintenance ✓
- View System-wide Analytics ✓
- Audit Trail Access ✓

## 7. NON-FUNCTIONAL REQUIREMENTS MAPPING

### 7.1 Performance
- **NFR-01:** Question load time < 500ms
- **NFR-02:** Real-time sync latency < 100ms
- **NFR-03:** Support 100+ concurrent players per game

### 7.2 Usability
- **NFR-04:** Mobile-responsive design (UC-LIVE-03, UC-LIVE-07)
- **NFR-05:** Keyboard navigation support (UC-UX-02)
- **NFR-06:** WCAG 2.1 AA compliance

### 7.3 Reliability
- **NFR-07:** Reconnection handling (UC-LIVE-11)
- **NFR-08:** Auto-save every 30 seconds (UC-QUES-02 to 06)
- **NFR-09:** 99.9% uptime

### 7.4 Security
- **NFR-10:** Profanity filtering (UC-LIVE-03, UC-CHAL-02)
- **NFR-11:** Input validation cho tất cả user inputs
- **NFR-12:** Session management với secure tokens

---

## 8. FUTURE ENHANCEMENTS (Out of Scope)

### Use Cases for Future Versions:
- **UC-AI-01:** Generate Questions from Document using LLM
- **UC-COMMUNITY-01:** Browse Community Quiz Library
- **UC-COMMUNITY-02:** Share Quiz to Community
- **UC-CLASSROOM-01:** Create Classroom
- **UC-CLASSROOM-02:** Assign Quiz to Students
- **UC-CLASSROOM-03:** Track Student Progress Over Time
- **UC-ANALYTICS-01:** Advanced Analytics per Student
- **UC-QUES-10:** Create Short Answer Question
- **UC-QUES-11:** Create Fill-in-the-Blank Question

---

**Document Status:** ✅ Complete  
**Review Status:** Pending Review  
**Next Steps:** 
1. Review với stakeholders
2. Create detailed sequence diagrams cho critical flows
3. Design database schema based on actors và use cases
4. Create wireframes/mockups aligned với use cases
