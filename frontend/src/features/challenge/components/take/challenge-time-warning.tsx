"use client";

import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle } from "lucide-react";
import { CHALLENGE_CONSTANTS } from "../../constants";
import { useChallengeStore, selectRemainingTime } from "../../store/challenge.store";

export function ChallengeTimeWarning() {
  const remainingTimeMs = useChallengeStore(selectRemainingTime);

  if (
    remainingTimeMs > CHALLENGE_CONSTANTS.TIMER.WARNING_THRESHOLD ||
    remainingTimeMs <= 0
  ) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {CHALLENGE_CONSTANTS.MESSAGES.TIME_RUNNING_OUT}
      </AlertDescription>
    </Alert>
  );
}

