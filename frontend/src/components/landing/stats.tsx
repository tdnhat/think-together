import { Star, Zap, Heart } from 'lucide-react';
import { StatCard, SectionContainer } from '@/components/shared';

const stats = [
  { value: '250k+', label: 'Câu trả lời', variant: 'secondary' as const },
  { value: '4.9/5', label: 'Đánh giá', variant: 'primary' as const },
  { value: '15+', label: 'Môn học', variant: 'primary' as const },
  { value: '24/7', label: 'Hỗ trợ', variant: 'secondary' as const }
];

export function Stats() {
  return (
    <SectionContainer>
      <div 
        className="bg-white rounded-3xl border-4 border-black p-8 md:p-12"
        style={{ boxShadow: '12px 12px 0 #00A8E8' }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-6 h-6 text-[#FFE066] fill-[#FFE066]" 
                />
              ))}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              Hơn 5.000 học sinh đã kiểm tra kiến thức!
            </h2>
            
            <p className="text-lg text-text-secondary mb-6">
              Tham gia cộng đồng học sinh đang ngày càng phát triển. 
              Cùng nhau học tập, chia sẻ và tiến bộ mỗi ngày.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div 
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full"
                style={{ boxShadow: '3px 3px 0 #FFE066' }}
              >
                <Zap className="w-5 h-5 text-[#FFE066] fill-[#FFE066]" />
                <span>Nhanh chóng</span>
              </div>
              
              <div 
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full"
                style={{ boxShadow: '3px 3px 0 #00A8E8' }}
              >
                <Heart className="w-5 h-5 text-[#00A8E8] fill-[#00A8E8]" />
                <span>Thú vị</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                variant={stat.variant}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
