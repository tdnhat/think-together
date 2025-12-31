"use client";

import { Sparkles } from "lucide-react";

interface HomeFeaturedBadgeProps {
  label?: string;
}

export function HomeFeaturedBadge({
  label = "Bài kiểm tra được đề xuất",
}: HomeFeaturedBadgeProps) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <p className="text-sm font-semibold text-foreground">
          {label}
        </p>
      </div>
    </section>
  );
}

