"use client";

import { Trophy, Users } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import type { ChallengeDto } from "@/features/challenge/types";

interface ChallengeInfoCardProps {
  challenge: ChallengeDto;
}

export function ChallengeInfoCard({ challenge }: ChallengeInfoCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {challenge.playCount} người đã thử
            </Badge>
            {challenge.showLeaderboard && (
              <Badge variant="outline" className="gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                Có bảng xếp hạng
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

