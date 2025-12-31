"use client";

import { LoadingSpinner } from "@/shared/ui/loading-spinner";

export function ChallengeResultsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

