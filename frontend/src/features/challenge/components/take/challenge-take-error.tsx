"use client";

import { Card, CardContent } from "@/shared/ui/card";

export function ChallengeTakeError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center">
          <p className="text-foreground font-semibold mb-2">
            Phiên làm bài không hợp lệ
          </p>
          <p className="text-muted-foreground text-sm">
            Vui lòng bắt đầu lại thử thách.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

