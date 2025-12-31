"use client";

import { Button } from "@/shared/ui/button";
import { DashboardLayout } from "@/widgets/dashboard";

interface QuizDetailErrorProps {
  onBack: () => void;
}

export function QuizDetailError({ onBack }: QuizDetailErrorProps) {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Không tìm thấy bộ trắc nghiệm
        </h2>
        <Button onClick={onBack} variant="outline">
          Quay lại
        </Button>
      </div>
    </DashboardLayout>
  );
}

