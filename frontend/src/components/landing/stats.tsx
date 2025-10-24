import { Heart, Star, Zap } from "lucide-react";

import { SectionContainer, StatCard } from "@/components/shared";

const stats = [
  { value: "250k+", label: "Câu trả lời", variant: "secondary" as const },
  { value: "4.9/5", label: "Đánh giá", variant: "primary" as const },
  { value: "15+", label: "Môn học", variant: "primary" as const },
  { value: "24/7", label: "Hỗ trợ", variant: "secondary" as const }
];

const ratingStars = [0, 1, 2, 3, 4] as const;

export function Stats() {
  return (
    <SectionContainer>
      <div 
        className="rounded-3xl border-4 border-[var(--color-border-main)] bg-white p-8 shadow-brutal-primary-xl md:p-12"
      >
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              {ratingStars.map((value) => (
                <Star 
                  key={`star-${value}`}
                  className="h-6 w-6 fill-[var(--brand-secondary)] text-[var(--brand-secondary)]"
                />
              ))}
            </div>
            
            <h2 className="mb-4 font-heading text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              Hơn 5.000 học sinh đã kiểm tra kiến thức!
            </h2>
            
            <p className="mb-6 text-lg text-[var(--text-secondary)]">
              Tham gia cộng đồng học sinh đang ngày càng phát triển. 
              Cùng nhau học tập, chia sẻ và tiến bộ mỗi ngày.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div 
                className="flex items-center gap-2 rounded-full border-2 border-[var(--color-border-main)] bg-white px-4 py-2 shadow-brutal-secondary-sm"
              >
                <Zap className="h-5 w-5 fill-[var(--brand-secondary)] text-[var(--brand-secondary)]" />
                <span>Nhanh chóng</span>
              </div>
              
              <div 
                className="flex items-center gap-2 rounded-full border-2 border-[var(--color-border-main)] bg-white px-4 py-2 shadow-brutal-primary-sm"
              >
                <Heart className="h-5 w-5 fill-[var(--brand-primary)] text-[var(--brand-primary)]" />
                <span>Thú vị</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
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
