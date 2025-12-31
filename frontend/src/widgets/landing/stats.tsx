import { Heart, Star, Zap } from "lucide-react";

import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { SectionContainer, StatCard } from "@/shared/components";
import { LANDING_STATS, RATING_STARS_COUNT } from "./constants";

export function Stats() {
  return (
    <SectionContainer>
      <Card
        className="p-8 md:p-12"
      >
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              {Array.from({ length: RATING_STARS_COUNT }, (_, i) => (
                <Star 
                  key={`star-${i}`}
                  className="h-6 w-6 fill-secondary text-secondary"
                />
              ))}
            </div>
            
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Hơn 5.000 học sinh đã kiểm tra kiến thức!
            </h2>
            
            <p className="mb-6 text-lg text-muted-foreground">
              Tham gia cộng đồng học sinh đang ngày càng phát triển. 
              Cùng nhau học tập, chia sẻ và tiến bộ mỗi ngày.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Zap className="h-5 w-5 fill-secondary text-secondary" />
                <span>Nhanh chóng</span>
              </Badge>
              
              <Badge variant="default" className="px-4 py-2">
                <Heart className="h-5 w-5 fill-white text-white" />
                <span>Thú vị</span>
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {LANDING_STATS.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                variant={stat.variant}
              />
            ))}
          </div>
        </div>
      </Card>
    </SectionContainer>
  );
}
