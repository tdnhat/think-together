import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
  background = 'white'
}: SectionContainerProps) {
  return (
    <section className={cn(
      "py-16 md:py-20 px-4 sm:px-6 lg:px-8",
      background === 'gray' && "bg-gray-50",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
