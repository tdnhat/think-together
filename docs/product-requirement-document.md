# Product Requirements Document (PRD) - ThinkTogether

**Phiên bản:** 1.0 (Final for Graduation Thesis)  
**Ngày:** 26/09/2025  
**Product Owner:** Truong Dinh Nhat

## 1. Tầm nhìn sản phẩm (Product Vision)

Xây dựng một nền tảng web giúp việc dạy, học và giải trí trở nên tương tác, hấp dẫn và hiệu quả hơn thông qua các dạng câu hỏi sáng tạo, tùy chọn linh hoạt và khả năng chia sẻ, ôn tập dễ dàng.

## 2. Đối tượng người dùng (User Personas)

- **Creator/Host (Người tạo/Tổ chức):** Giáo viên, giảng viên, trưởng nhóm, người quản lý cộng đồng.
- **Player (Người chơi):** Học sinh, sinh viên, nhân viên, thành viên cộng đồng.

## 3. Tổng quan các tính năng (Feature Summary)

Hệ thống cho phép Creator tạo các bộ câu hỏi đa dạng (trắc nghiệm, nối cặp, sắp xếp). Sau đó, họ có thể tổ chức một phiên chơi trực tiếp (Live Game) với mã PIN hoặc tạo một "Thử thách" bất đồng bộ (Challenge) để người khác tự ôn tập/chơi. Hệ thống cung cấp các tùy chọn linh hoạt khi chơi và báo cáo kết quả cơ bản.
## 4. Yêu cầu chi tiết (Features & Requirements)

### Module 1: Quản lý Nội dung (Content Management)

#### F1.1 - Quản lý Bộ câu hỏi (Quiz Set)
- Creator có thể **TẠO**, **SỬA**, **XÓA** các bộ câu hỏi của mình
- Mỗi bộ câu hỏi có: Tiêu đề, Mô tả, Ảnh bìa
- **F1.1.1 - Nhân bản Bộ câu hỏi:** Creator có thể nhân bản một bộ câu hỏi có sẵn để chỉnh sửa nhanh

#### F1.2 - Quản lý Câu hỏi (Question)
- Creator có thể **TẠO**, **SỬA**, **XÓA**, **KÉO-THẢ** để thay đổi thứ tự các câu hỏi
- Mỗi câu hỏi có: Nội dung, Thời gian trả lời, Điểm số, Loại câu hỏi, Media (hình ảnh/video tùy chọn)
- **F1.2.1 - Upload Video:** Creator có thể tải lên video (tối đa 2 phút) cho câu hỏi dạng Video Question
- **F1.2.2 - Video Preview & Timestamp Selection:** Creator có thể xem trước video và chọn thời điểm cụ thể để hiển thị câu hỏi

#### F1.3 - Các loại câu hỏi được hỗ trợ
- **Trắc nghiệm (Multiple Choice):** 1 câu hỏi, 2-6 lựa chọn, 1 đáp án đúng
- **Đúng/Sai (True/False):** 1 câu hỏi, 2 lựa chọn
- **Nối cặp (Matching):** Tối đa 5 cặp để nối
- **Sắp xếp (Ordering):** Tối đa 6 mục để sắp xếp
- **Video với câu hỏi (Video Question):** Video tối đa 2 phút, Creator có thể chọn thời điểm cụ thể để hiển thị câu hỏi trong video
### Module 2: Tổ chức Phiên chơi (Game Modes)

#### F2.1 - Chế độ Chơi trực tiếp (Live Game)

##### F2.1.1 - Tùy chọn khi Host
Trước khi bắt đầu, Host có thể tùy chỉnh:
- Số lượng câu hỏi (mặc định: tất cả)
- Thứ tự câu hỏi (Theo thứ tự / Ngẫu nhiên)
- Bật/tắt Nhạc nền
- Bật/tắt Hiển thị bảng xếp hạng sau mỗi câu hỏi
- Bật/tắt Tính điểm theo thời gian

##### F2.1.2 - Phòng chờ (Lobby)
- Hệ thống sinh mã PIN 6 chữ số
- Player tham gia ẩn danh bằng PIN và Nickname
- Host có quyền Kick người chơi
- Có bộ lọc từ ngữ cho nickname

##### F2.1.3 - Luồng chơi thời gian thực
- Trạng thái game được quản lý trên server để chống rớt mạng cho Host và cho phép Player kết nối lại

##### F2.1.4 - Giao diện chơi
- Màn hình Host hiển thị câu hỏi
- Màn hình Player hiển thị các nút tương tác

#### F2.2 - Chế độ "Thử thách" (Challenge Mode)
- Creator có thể tạo một link "Thử thách" cố định từ một bộ câu hỏi
- Người chơi truy cập link, nhập nickname và chơi một mình, bất cứ lúc nào
- Hệ thống lưu lại điểm và hiển thị bảng xếp hạng riêng cho "Thử thách" đó
### Module 3: Trải nghiệm Người chơi (Player Experience)

#### F3.1 - Tham gia dễ dàng
- Không cần đăng ký/đăng nhập để tham gia chơi

#### F3.2 - Tùy chỉnh cá nhân
- Người chơi có một nút duy nhất để Bật/Tắt toàn bộ âm thanh (nhạc nền và hiệu ứng) trên giao diện của mình

### Module 4: Báo cáo & Thống kê (Reporting)

#### F4.1 - Báo cáo sau phiên chơi
- Host có thể xem lại báo cáo của các phiên chơi đã kết thúc
- Báo cáo bao gồm:
  - Bảng xếp hạng đầy đủ (có phân trang)
  - Tỷ lệ trả lời đúng/sai cho từng câu hỏi

##### F4.1.1 - Xuất báo cáo
- Host có thể xuất bảng xếp hạng ra file CSV
## 5. Hướng phát triển tương lai (Out of Scope for this Project)

- Tích hợp AI (LLMs) để tự động tạo câu hỏi từ tài liệu
- Xây dựng Thư viện chung (Community Library) để chia sẻ và tìm kiếm bộ câu hỏi
- Chế độ "Lớp học" (Classroom) yêu cầu đăng nhập để theo dõi tiến bộ học sinh lâu dài
- Các dạng câu hỏi phức tạp hơn (tự luận, điền vào chỗ trống)
- Phân tích chi tiết cho từng học sinh
