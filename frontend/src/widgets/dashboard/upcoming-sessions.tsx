import Link from "next/link";
import { Button } from "@/shared";
import { Card } from "@/shared/ui/card";
import { ROUTES } from "@/config/routes";
import { MOCK_UPCOMING_SESSIONS } from "./constants";

export function UpcomingSessions() {
  return (
    <Card className="p-6">
      <h2 className="mb-4 font-heading text-2xl font-semibold text-[var(--text-primary)]">
        Các bài học sắp diễn ra
      </h2>
      <div className="space-y-4">
        {MOCK_UPCOMING_SESSIONS.map((session) => (
          <Card
            key={session}
            className="flex items-center justify-between px-4 py-3 text-[var(--text-secondary)]"
          >
            <div>
              <p className="font-heading text-base font-semibold text-[var(--text-primary)]">
                {session}
              </p>
              <p className="text-sm">Bắt đầu lúc 19:30 tối nay</p>
            </div>
            <Button asChild size="sm" variant="neutral" className="rounded-lg">
              <Link href={ROUTES.game.play}>Nhắc tôi</Link>
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
}

