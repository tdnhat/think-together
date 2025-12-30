import { Card } from "@/shared/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Stat card for displaying metrics
 * Used in Stats/Hero sections
 */
export function StatCard({
  value,
  label,
  className
}: Readonly<StatCardProps>) {
  return (
    <Card 
      className={cn("p-6 text-center", className)}
    >
      <div className="mb-2 text-4xl font-heading text-primary">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </Card>
  );
}
