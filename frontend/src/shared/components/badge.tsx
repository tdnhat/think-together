import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BrandBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Neo-brutalist badge component with colored shadow
 * Usage: Announcements, tags, labels
 */
export function BrandBadge({
  children,
  icon,
  variant = "secondary",
  className
}: Readonly<BrandBadgeProps>) {
  const variantStyles = variant === "primary" 
    ? "bg-[var(--brand-primary-light)]" 
    : "bg-[var(--brand-secondary-light)]";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5",
        "rounded-full border-2 border-[var(--color-border-main)]",
        "text-sm font-bold uppercase tracking-wide",
        "transition-all hover:-translate-y-0.5",
        variantStyles,
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
