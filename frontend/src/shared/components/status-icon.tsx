import type { LucideIcon } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { cn } from "@/lib/utils";

type StatusVariant = "loading" | "success" | "error" | "info";

interface StatusIconProps {
  icon: LucideIcon;
  variant?: StatusVariant;
  className?: string;
  iconClassName?: string;
  animate?: boolean;
}

const variantStyles: Record<StatusVariant, string> = {
  loading: "bg-muted text-primary",
  success: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
  error: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  info: "bg-muted text-primary",
};

/**
 * Reusable status icon container
 * Used for loading states, success/error messages, etc.
 */
export function StatusIcon({
  icon: Icon,
  variant = "info",
  className,
  iconClassName,
  animate = false,
}: Readonly<StatusIconProps>) {
  return (
    <Card
      className={cn(
        "mx-auto flex size-16 items-center justify-center rounded-2xl",
        variantStyles[variant],
        className
      )}
    >
      <Icon
        className={cn(
          "size-8",
          animate && "animate-spin",
          iconClassName
        )}
        strokeWidth={2.5}
      />
    </Card>
  );
}

