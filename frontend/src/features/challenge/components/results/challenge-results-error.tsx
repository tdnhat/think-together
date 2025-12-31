"use client";

import { Card, CardContent } from "@/shared/ui/card";

export function ChallengeResultsError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center">
          <p className="text-foreground font-semibold mb-2">
            Không tìm thấy kết quả
          </p>
          <p className="text-muted-foreground text-sm">
            Vui lòng kiểm tra lại liên kết.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

