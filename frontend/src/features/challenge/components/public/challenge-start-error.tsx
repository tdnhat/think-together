"use client";

import { Card, CardContent } from "@/shared/ui/card";

export function ChallengeStartError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center">
          <p className="text-foreground font-semibold mb-2">
            Không tìm thấy thử thách
          </p>
          <p className="text-muted-foreground text-sm">
            Liên kết thử thách không hợp lệ hoặc đã bị xóa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

