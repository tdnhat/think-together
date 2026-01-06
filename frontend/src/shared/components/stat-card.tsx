import { type LucideIcon } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  /**
   * Optional custom className for the value text
   * Useful for colored values (e.g., green for positive, red for negative)
   */
  valueClassName?: string;
  /**
   * Optional custom className for the label text
   */
  labelClassName?: string;
  /**
   * Optional icon to display above the value
   */
  icon?: LucideIcon;
}

/**
 * Stat card for displaying metrics
 * Used in Stats/Hero sections
 * 
 * @example
 * // Simple stat card
 * <StatCard value="42" label="Total Users" />
 * 
 * @example
 * // With custom value color
 * <StatCard 
 *   value="95.5" 
 *   label="Highest Score"
 *   valueClassName="text-green-600"
 * />
 * 
 * @example
 * // With icon
 * <StatCard 
 *   value="1,234" 
 *   label="Active Users"
 *   icon={Users}
 * />
 */
export function StatCard({
  value,
  label,
  className,
  valueClassName,
  labelClassName,
  icon: Icon,
}: Readonly<StatCardProps>) {
  return (
    <Card
      className={cn("p-6 text-center", className)}
    >
      {Icon && (
        <div className="mb-3 flex justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <div className={cn(
        "mb-2 text-4xl font-heading",
        valueClassName || "text-primary"
      )}>
        {value}
      </div>
      <div className={cn(
        "text-sm",
        labelClassName || "text-muted-foreground"
      )}>
        {label}
      </div>
    </Card>
  );
}
