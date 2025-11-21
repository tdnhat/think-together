import { BookOpen, Crown, Target } from "lucide-react";

export const QUICK_ACTIONS = [
  {
    title: "Tiếp tục học",
    description: "Hoàn thành phần còn lại của thử thách tuần này.",
    href: "/play",
    icon: BookOpen,
    accent: "primary" as const,
  },
  {
    title: "Tạo thử thách",
    description: "Thiết kế bộ câu hỏi mới cho lớp của bạn.",
    href: "/quiz/new",
    icon: Target,
    accent: "secondary" as const,
  },
  {
    title: "Xem bảng xếp hạng",
    description: "Khám phá vị trí của bạn trong cộng đồng.",
    href: "/leaderboard",
    icon: Crown,
    accent: "primary" as const,
  },
] as const;

export const MOCK_HIGHLIGHT_CARDS = [
  {
    title: "Chuỗi học tập",
    value: "5 ngày liên tiếp",
    description: "Giữ nhịp độ nhé!",
  },
  {
    title: "Điểm trung bình",
    value: "92%",
    description: "Xuất sắc hơn 87% bạn học.",
  },
  {
    title: "Bài đã hoàn thành",
    value: "18",
    description: "Gần đạt mục tiêu tháng này.",
  },
] as const;

export const MOCK_UPCOMING_SESSIONS = [
  "Toán học nâng cao",
  "Khoa học khám phá",
  "Lịch sử thế giới"
] as const;

export const MOCK_WEEKLY_GOALS = [
  "Hoàn thành ít nhất 3 bài kiểm tra mới",
  "Chia sẻ 1 bộ câu hỏi với bạn học",
  "Duy trì điểm trung bình trên 90%",
] as const;

