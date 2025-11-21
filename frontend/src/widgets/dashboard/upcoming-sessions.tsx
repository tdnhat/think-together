import Link from "next/link";
import { Button } from "@/shared";
import { MOCK_UPCOMING_SESSIONS } from "./constants";

export function UpcomingSessions() {
  return (
    <div className="rounded-3xl border border-[var(--color-border-main)] bg-[var(--bg-surface)] p-6 shadow-brutal">
      <h2 className="mb-4 font-heading text-2xl font-semibold text-[var(--text-primary)]">
        Các bài học sắp diễn ra
      </h2>
      <div className="space-y-4">
        {MOCK_UPCOMING_SESSIONS.map((session) => (
          <div
            key={session}
            className="flex items-center justify-between rounded-2xl border border-[var(--color-border-main)] bg-[var(--bg-surface)]/80 px-4 py-3 text-[var(--text-secondary)] shadow-brutal-sm"
          >
            <div>
              <p className="font-heading text-base font-semibold text-[var(--text-primary)]">
                {session}
              </p>
              <p className="text-sm">Bắt đầu lúc 19:30 tối nay</p>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-lg shadow-brutal-secondary-sm">
              <Link href="/play">Nhắc tôi</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

