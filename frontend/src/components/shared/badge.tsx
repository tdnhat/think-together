import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BrandBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * Neo-brutalist badge component with colored shadow
 * Usage: Announcements, tags, labels
 */
export function BrandBadge({ 
  children, 
  icon, 
  variant = 'secondary',
  className 
}: BrandBadgeProps) {
  const shadowColor = variant === 'primary' ? '#00A8E8' : '#FFE066';
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2",
        "bg-white border-2 border-black rounded-full",
        "font-medium text-sm",
        className
      )}
      style={{ boxShadow: `3px 3px 0 ${shadowColor}` }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
