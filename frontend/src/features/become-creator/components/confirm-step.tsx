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
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-border bg-secondary">
          <Sparkles className="h-10 w-10 text-foreground" strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-bold text-foreground font-heading">
          Sẵn sàng trở thành Người sáng tạo?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground font-sans">
          Bạn sẽ có quyền truy cập đầy đủ vào tất cả các tính năng tạo nội dung
        </p>
      </div>

      <div className="space-y-3 rounded-xl border-2 border-border bg-secondary/10 p-5">
        {CREATOR_BENEFITS.map((benefit) => (
          <div key={benefit} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-primary text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={4} />
            </div>
            <span className="text-base font-medium text-foreground font-sans">
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
        >
          <ArrowLeft className="mr-2 h-5 w-5" strokeWidth={3} />
          Quay lại
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={onActivate}
          disabled={isActivating}
        >
          {isActivating ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Đang kích hoạt...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" strokeWidth={2.5} />
              Trở thành Người sáng tạo ngay!
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

