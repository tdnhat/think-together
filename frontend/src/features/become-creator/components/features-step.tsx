"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import { CREATOR_FEATURES } from "../constants";

interface FeaturesStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function FeaturesStep({ onNext, onBack }: Readonly<FeaturesStepProps>) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] font-heading">
          Những gì bạn sẽ làm được
        </h2>
        <p className="mt-3 text-lg text-[var(--text-secondary)] font-sans">
          Khám phá các công cụ mạnh mẽ cho việc giáo dục tương tác
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CREATOR_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          // Alternate colors for variety
          const colors = [
            'bg-[var(--brand-primary-light)]',
            'bg-[var(--brand-secondary-light)]',
            'bg-[var(--accent-pink-light)]',
            'bg-[var(--accent-cyan-light)]'
          ];
          const iconBg = colors[index % colors.length];
          
          return (
            <div
              key={feature.title}
              className="flex flex-col items-start gap-4 rounded-xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] p-5 shadow-brutal-sm transition-all hover:-translate-y-1 hover:shadow-brutal"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[var(--color-border-main)] ${iconBg} text-[var(--text-primary)] shadow-brutal-xs`}>
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-heading font-bold text-[var(--text-primary)] text-lg">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-sans">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="neutral"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-5 w-5" strokeWidth={3} />
          Quay lại
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={onNext}
        >
          Tiếp tục <ArrowRight className="ml-2 h-5 w-5" strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}

