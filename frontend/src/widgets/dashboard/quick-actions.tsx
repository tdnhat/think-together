import Link from "next/link";
import { QUICK_ACTIONS } from "./constants";

export function QuickActions() {
  return (
    <aside className="flex flex-col gap-4">
      {QUICK_ACTIONS.map(({ title, description, href, icon: Icon, accent }) => (
        <Link
          key={title}
          href={href}
          className="group rounded-2xl border border-[var(--color-border-main)] bg-[var(--bg-surface)] p-5 shadow-brutal transition-transform duration-200 hover:-translate-y-1"
        >
          <div className="flex items-start gap-4">
            <span
              className={accent === "primary"
                ? "flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--color-border-main)] bg-[var(--brand-primary)] text-white shadow-brutal-sm"
                : "flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--color-border-main)] bg-[var(--brand-secondary)] text-[var(--text-primary)] shadow-brutal-sm"}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p className="font-heading text-lg font-semibold text-[var(--text-primary)]">{title}</p>
              <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>
          </div>
        </Link>
      ))}
    </aside>
  );
}

