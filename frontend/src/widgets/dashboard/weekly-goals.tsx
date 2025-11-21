import { MOCK_WEEKLY_GOALS } from "./constants";

export function WeeklyGoals() {
  return (
    <div className="rounded-3xl border border-[var(--color-border-main)] bg-[var(--bg-surface)] p-6 shadow-brutal">
      <h2 className="mb-4 font-heading text-2xl font-semibold text-[var(--text-primary)]">
        Mục tiêu tuần này
      </h2>
      <ul className="space-y-3 text-[var(--text-secondary)]">
        {MOCK_WEEKLY_GOALS.map((goal) => (
          <li
            key={goal}
            className="flex items-start gap-3 rounded-2xl border border-[var(--color-border-main)] bg-[var(--bg-surface)]/80 px-4 py-3 shadow-brutal-sm"
          >
            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[var(--brand-primary)]" />
            <span>{goal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

