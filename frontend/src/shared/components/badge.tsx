import { type ReactNode } from "react";
import { Card } from "@/shared/ui/card";
import { cn } from "@/lib/utils";

interface BrandBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Badge component with standard card style
 * Usage: Announcements, tags, labels
 */
export function BrandBadge({
  children,
  icon,
  variant = "secondary",
  className
}: Readonly<BrandBadgeProps>) {
  const variantStyles = variant === "primary" 
    ? "bg-primary/10 border-primary/20" 
    : "bg-accent/10 border-accent/20";

  return (
    <Card
      className={cn(
        "inline-flex flex-row items-center gap-2 px-5 py-2.5 rounded-full border",
        "text-sm font-bold uppercase tracking-wide",
        variantStyles,
        className
      )}
    >
      {icon && (
        <span className="flex-shrink-0 flex items-center">{icon}</span>
      )}
      <span className="leading-none">{children}</span>
    </Card>
  );
}
