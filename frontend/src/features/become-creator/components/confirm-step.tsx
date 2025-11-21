"use client";

import { Sparkles, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import { CREATOR_BENEFITS } from "../constants";

interface ConfirmStepProps {
  isActivating: boolean;
  onActivate: () => void;
  onBack: () => void;
}

export function ConfirmStep({ isActivating, onActivate, onBack }: Readonly<ConfirmStepProps>) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--color-border-main)] bg-gradient-to-br from-[var(--brand-secondary)] to-[var(--brand-primary)] shadow-brutal">
          <Sparkles className="h-10 w-10 text-[var(--text-primary)]" strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Raleway' }}>
          Sẵn sàng trở thành Người sáng tạo?
        </h2>
        <p className="mt-3 text-lg text-[var(--text-secondary)]" style={{ fontFamily: 'Be Vietnam Pro' }}>
          Bạn sẽ có quyền truy cập đầy đủ vào tất cả các tính năng tạo nội dung
        </p>
      </div>

      <div className="space-y-3 rounded-xl border-2 border-[var(--color-border-main)] bg-gradient-to-br from-[var(--brand-secondary)]/10 to-[var(--brand-primary)]/10 p-4 shadow-brutal-sm">
        {CREATOR_BENEFITS.map((benefit) => (
          <div key={benefit} className="flex items-start gap-3">
            <Check className="mt-1 h-6 w-6 shrink-0 text-[var(--brand-primary)]" strokeWidth={3} />
            <span className="text-base text-[var(--text-primary)]" style={{ fontFamily: 'Be Vietnam Pro' }}>
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isActivating}
          className="border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Button
          type="button"
          onClick={onActivate}
          disabled={isActivating}
          className="border-2 border-[var(--color-border-main)] bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-[var(--text-primary)] font-semibold shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Quicksand' }}
        >
          {isActivating ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Đang kích hoạt...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" strokeWidth={2} />
              Trở thành Người sáng tạo ngay!
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

