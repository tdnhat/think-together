import { Brain, Trophy, TrendingUp, Users } from 'lucide-react';
import { FeatureCard, SectionContainer } from '@/components/shared';

const features = [
  {
    icon: Brain,
    title: 'Làm bài kiểm tra',
    description: 'Hàng ngàn câu hỏi đa dạng từ nhiều môn học, phù hợp với mọi trình độ.',
    variant: 'primary' as const
  },
  {
    icon: TrendingUp,
    title: 'Theo dõi tiến trình',
    description: 'Xem chi tiết kết quả, phân tích điểm mạnh và cải thiện điểm yếu.',
    variant: 'secondary' as const
  },
  {
    icon: Trophy,
    title: 'Cạnh tranh bạn bè',
    description: 'Tham gia bảng xếp hạng, thách thức bạn bè và giành thành tích.',
    variant: 'primary' as const
  },
  {
    icon: Users,
    title: 'Cộng đồng năng động',
    description: 'Kết nối với học sinh khác, chia sẻ kinh nghiệm và cùng nhau tiến bộ.',
    variant: 'secondary' as const
  }
];

export function Features() {
  return (
    <SectionContainer background="gray">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
          Tính năng nổi bật
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Mọi thứ bạn cần để học tập hiệu quả và vui vẻ
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            variant={feature.variant}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
