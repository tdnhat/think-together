"use client";

import { LoadingSpinner } from "@/shared/ui/loading-spinner";
import { DashboardLayout } from "@/widgets/dashboard";

export function QuizDetailLoading() {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    </DashboardLayout>
  );
}

