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
  const variantShadowClass = variant === "primary" ? "shadow-brutal-primary-sm" : "shadow-brutal-secondary-sm";
  const iconThemeClass =
    variant === "primary"
      ? "bg-gradient-to-br from-[var(--brand-primary)] to-[var(--accent-purple)] text-white"
      : "bg-gradient-to-br from-[var(--brand-secondary)] to-[var(--accent-orange)] text-[var(--text-primary)]";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] p-7",
        "transition-all duration-200 hover:-translate-y-2 hover:shadow-brutal",
        variantShadowClass,
        className
      )}
    >
      <div
        className={cn(
          "mb-5 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[var(--color-border-main)]",
          "shadow-brutal-xs",
          iconThemeClass
        )}
      >
        <Icon className="h-8 w-8" strokeWidth={2.5} />
      </div>
      
      <h3 className="mb-3 font-heading font-bold text-xl text-[var(--text-primary)]">
        {title}
      </h3>
      
      <p className="text-base leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}
