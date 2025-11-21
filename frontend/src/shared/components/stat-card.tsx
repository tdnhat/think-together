import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Stat card for displaying metrics with neo-brutalist style
 * Used in Stats/Hero sections
 */
export function StatCard({
  value,
  label,
  variant = "secondary",
  className
}: Readonly<StatCardProps>) {
  const variantShadowClass = variant === "primary" ? "shadow-brutal-primary" : "shadow-brutal-secondary";

  return (
    <div 
      className={cn(
        "rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] p-6 text-center",
        variantShadowClass,
        className
      )}
    >
      <div className="mb-2 text-4xl font-heading text-[var(--brand-primary)]">
        {value}
      </div>
      <div className="text-sm text-[var(--text-secondary)]">
        {label}
      </div>
    </div>
  );
}
