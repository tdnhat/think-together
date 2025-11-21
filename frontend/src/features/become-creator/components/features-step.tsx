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
        <h2 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Raleway' }}>
          Những gì bạn sẽ làm được
        </h2>
        <p className="mt-3 text-lg text-[var(--text-secondary)]" style={{ fontFamily: 'Be Vietnam Pro' }}>
          Khám phá các công cụ mạnh mẽ cho việc giáo dục tương tác
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CREATOR_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex flex-col items-start gap-4 rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] p-6 shadow-brutal-sm transition-all hover:-translate-y-1 hover:shadow-brutal"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[var(--color-border-main)] bg-gradient-to-br from-[var(--brand-primary)] to-[var(--accent-purple)] text-white shadow-brutal-xs">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-heading font-bold text-[var(--text-primary)] text-lg">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="border-2 border-[var(--color-border-main)] bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-[var(--text-primary)] font-semibold shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          style={{ fontFamily: 'Quicksand' }}
        >
          Tiếp tục <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

