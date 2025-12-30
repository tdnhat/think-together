import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray';
}

/**
 * Section container with max-width and consistent padding
 * Follows STYLE_GUIDE.md layout rules
 */
export function SectionContainer({
  children,
  className,
  background = "white"
}: Readonly<SectionContainerProps>) {
  return (
    <section className={cn(
      "px-4 py-16 md:py-20 sm:px-6 lg:px-8",
      background === "gray" && "bg-muted",
      className
    )}>
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </section>
  );
}
