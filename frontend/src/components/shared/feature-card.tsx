import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Feature card with neo-brutalist style and colored shadow
 * Used in Features section of landing page
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = "primary",
  className
}: Readonly<FeatureCardProps>) {
  const variantShadowClass = variant === "primary" ? "shadow-brutal-primary" : "shadow-brutal-secondary";
  const iconThemeClass =
    variant === "primary"
      ? "bg-[var(--brand-primary)] text-white"
      : "bg-[var(--brand-secondary)] text-[var(--text-primary)]";

  return (
    <div
      className={cn(
        "rounded-2xl border-3 border-[var(--color-border-main)] bg-white p-6",
        "transition-transform duration-200 hover:-translate-y-1",
        variantShadowClass,
        className
      )}
    >
      <div
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[var(--color-border-main)]",
          "shadow-brutal",
          iconThemeClass
        )}
      >
        <Icon className="h-7 w-7" />
      </div>
      
      <h3 className="mb-2 font-heading text-xl text-[var(--text-primary)]">
        {title}
      </h3>
      
      <p className="text-base text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}
