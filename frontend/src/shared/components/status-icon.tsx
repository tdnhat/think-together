import type { LucideIcon } from "lucide-react";
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
  loading: "bg-[var(--bg-surface)] text-[var(--brand-primary)]",
  success: "bg-[var(--accent-green-light)] text-[var(--color-success)]",
  error: "bg-[var(--accent-pink-light)] text-[var(--color-error)]",
  info: "bg-[var(--bg-surface)] text-[var(--brand-primary)]",
};

/**
 * Reusable status icon container with neo-brutalist styling
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
    <div
      className={cn(
        "mx-auto flex size-16 items-center justify-center",
        "rounded-2xl border-2 border-[var(--color-border-main)]",
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
    </div>
  );
}

