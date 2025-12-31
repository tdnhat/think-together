"use client";

import { Trophy } from "lucide-react";
import { Separator } from "@/shared/ui/separator";
import { LoadingSpinner } from "@/shared/ui/loading-spinner";
import { LeaderboardTable } from "../leaderboard-table";
import type { ChallengeLeaderboardDto } from "../../types";

interface ChallengeResultsLeaderboardProps {
  leaderboard: ChallengeLeaderboardDto | null | undefined;
  isLoading: boolean;
  attemptId: string | null;
}

export function ChallengeResultsLeaderboard({
  leaderboard,
  isLoading,
  attemptId,
}: ChallengeResultsLeaderboardProps) {
  if (!leaderboard || leaderboard.entries.length === 0) {
    return null;
  }

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Bảng xếp hạng
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <LeaderboardTable
            entries={leaderboard.entries}
            highlightAttemptId={attemptId || undefined}
          />
        )}
      </div>
    </>
  );
}

