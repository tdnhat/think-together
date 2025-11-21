import { Brain, Trophy, TrendingUp, Users } from "lucide-react";

export const LANDING_FEATURES = [
  {
    icon: Brain,
    title: "Làm bài kiểm tra",
    description: "Hàng ngàn câu hỏi đa dạng từ nhiều môn học, phù hợp với mọi trình độ.",
    variant: "primary" as const
  },
  {
    icon: TrendingUp,
    title: "Theo dõi tiến trình",
    description: "Xem chi tiết kết quả, phân tích điểm mạnh và cải thiện điểm yếu.",
    variant: "secondary" as const
  },
  {
    icon: Trophy,
    title: "Cạnh tranh bạn bè",
    description: "Tham gia bảng xếp hạng, thách thức bạn bè và giành thành tích.",
    variant: "primary" as const
  },
  {
    icon: Users,
    title: "Cộng đồng năng động",
    description: "Kết nối với học sinh khác, chia sẻ kinh nghiệm và cùng nhau tiến bộ.",
    variant: "secondary" as const
  }
] as const;

export const LANDING_STATS = [
  { value: "250k+", label: "Câu trả lời", variant: "secondary" as const },
  { value: "4.9/5", label: "Đánh giá", variant: "primary" as const },
  { value: "15+", label: "Môn học", variant: "primary" as const },
  { value: "24/7", label: "Hỗ trợ", variant: "secondary" as const }
] as const;

export const RATING_STARS_COUNT = 5;

export const HERO_STATS = [
  { value: "5,000+", label: "Học sinh" },
  { value: "10,000+", label: "Câu hỏi" },
  { value: "98%", label: "Hài lòng" }
] as const;

