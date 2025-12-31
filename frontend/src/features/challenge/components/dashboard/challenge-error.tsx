"use client";

import { Button } from "@/shared/ui/button";
import { DashboardLayout } from "@/widgets/dashboard";

interface ChallengeErrorProps {
  onBack: () => void;
}

export function ChallengeError({ onBack }: ChallengeErrorProps) {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Chưa có thử thách
        </h2>
        <p className="text-muted-foreground">
          Bộ trắc nghiệm này chưa có thử thách nào.
        </p>
        <Button onClick={onBack} variant="outline">
          Quay lại
        </Button>
      </div>
    </DashboardLayout>
  );
}

