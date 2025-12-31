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
                  ? "flex h-11 w-11 items-center justify-center rounded-xl border border-primary/50 bg-primary text-primary-foreground"
                  : "flex h-11 w-11 items-center justify-center rounded-xl border border-secondary/50 bg-secondary text-secondary-foreground"}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="space-y-1">
                <p className="font-heading text-lg font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </aside>
  );
}

