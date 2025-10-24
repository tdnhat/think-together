import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'primary' | 'secondary';
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
  variant = 'primary',
  className 
}: FeatureCardProps) {
  const shadowColor = variant === 'primary' ? '#00A8E8' : '#FFE066';
  const iconBg = variant === 'primary' ? '#00A8E8' : '#FFE066';
  const iconColor = variant === 'primary' ? '#fff' : '#000';
  
  return (
    <div
      className={cn(
        "bg-white p-6 rounded-2xl border-3 border-black",
        "hover-brutal-push cursor-pointer",
        className
      )}
      style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
    >
      <div 
        className="w-14 h-14 rounded-xl border-2 border-black flex items-center justify-center mb-4"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-7 h-7" style={{ color: iconColor }} />
      </div>
      
      <h3 className="font-heading text-xl mb-2 text-text-primary">
        {title}
      </h3>
      
      <p className="text-text-secondary text-base">
        {description}
      </p>
    </div>
  );
}
