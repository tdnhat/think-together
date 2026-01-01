import Link from "next/link";
import { Card, CardContent } from "@/shared/ui/card";
import { QUICK_ACTIONS } from "./constants";
import { cn } from "@/lib/utils";

export function QuickActions() {
  return (
    <aside className="flex flex-col gap-4">
      {QUICK_ACTIONS.map(({ title, description, href, icon: Icon, accent }) => (
        <Link key={title} href={href} className="block transition-opacity hover:opacity-80">
          <Card>
            <CardContent className="flex items-start gap-4 p-5">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                  accent === "primary"
                    ? "border-primary/50 bg-primary text-primary-foreground"
                    : "border-secondary/50 bg-secondary text-secondary-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="space-y-1">
                <p className="font-heading text-lg font-semibold text-foreground">
                  {title}
                </p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </aside>
  );
}

