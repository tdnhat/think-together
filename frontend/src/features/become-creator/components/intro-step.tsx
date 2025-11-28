"use client";

import { Sparkles, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/shared";

interface IntroStepProps {
  onNext: () => void;
  onClose: () => void;
}

export function IntroStep({ onNext, onClose }: Readonly<IntroStepProps>) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-[var(--color-border-main)] bg-[var(--brand-secondary)] shadow-brutal">
          <Sparkles className="h-12 w-12 text-[var(--text-primary)]" strokeWidth={2} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] font-heading">
            Trở thành Người sáng tạo?
          </h2>
          <p className="text-lg text-[var(--text-secondary)] font-sans">
            Khám phá sức mạnh của việc tạo nội dung tương tác cho học sinh của bạn
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg border-2 border-[var(--color-border-main)] bg-[var(--brand-secondary-light)] p-4 shadow-brutal-sm">
          <Rocket className="h-6 w-6 shrink-0 text-[var(--text-primary)] mt-1" strokeWidth={2} />
          <p className="text-base text-[var(--text-primary)] font-sans font-medium">
            Chúng tôi sẽ hướng dẫn bạn khám phá các tính năng đang chờ đón bạn. Mất không quá 30 giây!
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="neutral"
          onClick={onClose}
        >
          Hủy
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={onNext}
        >
          Bắt đầu <ArrowRight className="ml-2 h-5 w-5" strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}

