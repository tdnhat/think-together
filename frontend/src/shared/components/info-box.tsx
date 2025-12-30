import type { ReactNode } from "react";
import { Card } from "@/shared/ui/card";
import { cn } from "@/lib/utils";

type InfoBoxVariant = "default" | "dashed" | "countdown";

interface InfoBoxProps {
  children: ReactNode;
  variant?: InfoBoxVariant;
  className?: string;
}

/**
 * Reusable info box component
 * Used for informational messages, instructions, countdowns
 */
export function InfoBox({
  children,
  variant = "default",
  className,
}: Readonly<InfoBoxProps>) {
  if (variant === "countdown") {
    return (
      <div className={cn("rounded-xl border border-dashed border-border bg-muted px-4 py-2 text-sm text-muted-foreground", className)}>
        {children}
      </div>
    );
  }

  return (
    <Card 
      className={cn(
        "p-4",
        variant === "dashed" && "border-dashed",
        className
      )}
    >
      {children}
    </Card>
  );
}

