"use client";

import { Home, Share2, RotateCcw } from "lucide-react";
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
      <Button variant="default" size="lg" onClick={onRetry} className="gap-2 flex-1 sm:flex-initial">
        <RotateCcw />
        Thử lại
      </Button>
      <Button variant="outline" size="lg" onClick={onShare} className="gap-2 flex-1 sm:flex-initial">
        <Share2 />
        Chia sẻ
      </Button>
      <Button variant="outline" size="lg" onClick={onHome} className="gap-2 flex-1 sm:flex-initial">
        <Home />
        Về trang chủ
      </Button>
    </div>
  );
}

