"use client";

import { LoadingSpinner } from "@/shared/ui/loading-spinner";

export function HomeLoadingState() {
  return (
    <section>
      <div className="flex h-40 items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    </section>
  );
}

