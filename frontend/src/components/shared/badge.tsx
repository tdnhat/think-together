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
  const variantShadowClass = variant === "primary" ? "shadow-brutal-primary-sm" : "shadow-brutal-secondary-sm";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2",
        "rounded-full border-2 border-[var(--color-border-main)] bg-white",
        "text-sm font-medium",
        variantShadowClass,
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
