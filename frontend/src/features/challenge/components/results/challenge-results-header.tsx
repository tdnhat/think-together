"use client";

import { Trophy } from "lucide-react";
import { PageHeader } from "@/shared/components";

export function ChallengeResultsHeader() {
  return (
    <PageHeader bordered>
      <div className="flex items-center gap-2">
        <Trophy className="h-8 w-8 text-primary" />
        <span className="font-heading text-2xl font-bold text-foreground">
          Kết quả thử thách
        </span>
      </div>
    </PageHeader>
  );
}

