"use client";

import { TrendingUp } from "lucide-react";
import { Card } from "@/shared/ui/card";

export function HomeEmptyState() {
  return (
    <section>
      <Card className="flex flex-col items-center justify-center border-dashed border-border bg-muted py-20 px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 font-heading text-xl text-foreground">
          Chưa có bài kiểm tra
        </h3>
        <p className="text-muted-foreground">
          Hiện chưa có bài kiểm tra nào được công bố. Quay lại sau!
        </p>
      </Card>
    </section>
  );
}

