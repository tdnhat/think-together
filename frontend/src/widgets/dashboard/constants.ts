import {
  Activity,
  BookOpen,
  Clock,
  Crown,
  GraduationCap,
  Home,
  Settings,
  Star,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/config/routes";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const SIDEBAR_NAVIGATION: NavigationGroup[] = [
  {
    title: "Menu chính",
    items: [
      { title: "Trang chủ", url: ROUTES.dashboard.home, icon: Home },
      { title: "Bộ câu hỏi", url: ROUTES.quiz.list, icon: BookOpen },
      { title: "Lớp học", url: ROUTES.classes.list, icon: GraduationCap },
      { title: "Bảng xếp hạng", url: ROUTES.leaderboard, icon: TrendingUp },
      { title: "Tiến trình", url: "/progress", icon: Activity }, // TODO: Add to routes when implemented
    ],
  },
  {
    title: "Khác",
    items: [
      { title: "Bài đã lưu", url: "/saved", icon: Star }, // TODO: Add to routes when implemented
      { title: "Lịch sử", url: "/history", icon: Clock }, // TODO: Add to routes when implemented
      { title: "Cộng đồng", url: "/community", icon: Users }, // TODO: Add to routes when implemented
      { title: "Cài đặt", url: ROUTES.dashboard.settings, icon: Settings },
    ],
  },
] as const;

export const QUICK_ACTIONS = [
  {
    title: "Tiếp tục học",
    description: "Hoàn thành phần còn lại của thử thách tuần này.",
    href: ROUTES.game.play,
    icon: BookOpen,
    accent: "primary" as const,
  },
  {
    title: "Tạo thử thách",
    description: "Thiết kế bộ câu hỏi mới cho lớp của bạn.",
    href: ROUTES.quiz.create,
    icon: Target,
    accent: "secondary" as const,
  },
  {
    title: "Xem bảng xếp hạng",
    description: "Khám phá vị trí của bạn trong cộng đồng.",
    href: ROUTES.leaderboard,
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

