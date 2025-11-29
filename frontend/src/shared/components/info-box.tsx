import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InfoBoxVariant = "default" | "dashed" | "countdown";

interface InfoBoxProps {
  children: ReactNode;
  variant?: InfoBoxVariant;
  className?: string;
}

const variantStyles: Record<InfoBoxVariant, string> = {
  default: "rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] p-4",
  dashed: "rounded-2xl border border-dashed border-[var(--color-border-main)] bg-[var(--bg-surface)] p-4",
  countdown: "rounded-xl border border-dashed border-[var(--color-border-main)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)]/80",
};

/**
 * Reusable info box with neo-brutalist styling
 * Used for informational messages, instructions, countdowns
 */
export function InfoBox({
  children,
  variant = "default",
  className,
}: Readonly<InfoBoxProps>) {
  return (
    <div className={cn(variantStyles[variant], className)}>
      {children}
    </div>
  );
}

