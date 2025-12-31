"use client";

import { Home, Share2 } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ChallengeResultsActionsProps {
  onRetry: () => void;
  onShare: () => void;
  onHome: () => void;
}

export function ChallengeResultsActions({
  onRetry,
  onShare,
  onHome,
}: ChallengeResultsActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button variant="default" onClick={onRetry} className="gap-2">
        Thử lại
      </Button>
      <Button variant="outline" onClick={onShare} className="gap-2">
        <Share2 className="h-4 w-4" />
        Chia sẻ
      </Button>
      <Button variant="outline" onClick={onHome} className="gap-2">
        <Home className="h-4 w-4" />
        Về trang chủ
      </Button>
    </div>
  );
}

