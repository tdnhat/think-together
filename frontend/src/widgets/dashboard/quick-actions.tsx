import Link from "next/link";
import { Card } from "@/shared/ui/card";
import { QUICK_ACTIONS } from "./constants";

export function QuickActions() {
  return (
    <aside className="flex flex-col gap-4">
      {QUICK_ACTIONS.map(({ title, description, href, icon: Icon, accent }) => (
        <Link key={title} href={href}>
          <Card
            className="p-5"
          >
            <div className="flex items-start gap-4">
              <span
                className={accent === "primary"
                  ? "flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--brand-primary-hover)] bg-[var(--brand-primary)] text-white shadow-brutal-primary-xs"
                  : "flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--brand-secondary-hover)] bg-[var(--brand-secondary)] text-[var(--text-primary)] shadow-brutal-secondary-xs"}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="space-y-1">
                <p className="font-heading text-lg font-semibold text-[var(--text-primary)]">{title}</p>
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </aside>
  );
}

