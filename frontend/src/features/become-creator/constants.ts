import { BookOpen, Users, BarChart3, Sparkles } from "lucide-react";

export const BECOME_CREATOR_STEPS = ["intro", "features", "confirm"] as const;

export type BecomeCreatorStep = typeof BECOME_CREATOR_STEPS[number];

export const CREATOR_FEATURES = [
  {
    icon: BookOpen,
    title: "Tạo Bộ Câu Hỏi",
    description: "Thiết kế các bộ câu hỏi đa dạng với nhiều định dạng: trắc nghiệm, đúng sai, ghép cặp..."
  },
  {
    icon: Users,
    title: "Tổ Chức Trò Chơi Trực Tiếp",
    description: "Host các phiên chơi trực tiếp với mã PIN, tương tác thời gian thực với học sinh của bạn"
  },
  {
    icon: BarChart3,
    title: "Phân Tích Kết Quả",
    description: "Xem báo cáo chi tiết về hiệu suất học tập, tỷ lệ trả lời đúng và phân tích từng câu hỏi"
  },
  {
    icon: Sparkles,
    title: "Tạo Thử Thách",
    description: "Tạo liên kết thử thách cho phép học sinh chơi theo nhịp độ riêng của họ bất cứ lúc nào"
  }
] as const;

export const CREATOR_BENEFITS = [
  "Tạo và quản lý vô hạn các bộ câu hỏi của riêng bạn",
  "Host các trò chơi trực tiếp và tương tác với học sinh",
  "Xem báo cáo chi tiết về hiệu suất và tiến độ học tập",
  "Tạo các thử thách không giới hạn cho học sinh"
] as const;

