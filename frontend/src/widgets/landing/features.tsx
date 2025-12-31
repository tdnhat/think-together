import { FeatureCard, SectionContainer } from "@/shared/components";
import { LANDING_FEATURES } from "./constants";

export function Features() {
  return (
    <SectionContainer background="gray">
      <div className="mb-12 text-center">
        <h2 className="mb-4 font-heading text-4xl font-bold text-foreground md:text-5xl">
          Tính năng nổi bật
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Mọi thứ bạn cần để học tập hiệu quả và vui vẻ
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LANDING_FEATURES.map((feature) => (
          <FeatureCard
            key={feature.title}
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
