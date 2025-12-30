import { type LucideIcon } from "lucide-react";

import { Card } from "@/shared/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Feature card component
 * Used in Features section of landing page
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = "primary",
  className
}: Readonly<FeatureCardProps>) {
  const iconThemeClass =
    variant === "primary"
      ? "bg-gradient-to-br from-primary to-purple-500 text-primary-foreground"
      : "bg-gradient-to-br from-accent to-orange-500 text-foreground";

  return (
    <Card
      className={cn("p-7", className)}
    >
      <div
        className={cn(
          "mb-5 flex h-16 w-16 items-center justify-center rounded-xl",
          iconThemeClass
        )}
      >
        <Icon className="h-8 w-8" strokeWidth={2.5} />
      </div>
      
      <h3 className="mb-3 font-heading font-bold text-xl text-foreground">
        {title}
      </h3>
      
      <p className="text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
    </Card>
  );
}
