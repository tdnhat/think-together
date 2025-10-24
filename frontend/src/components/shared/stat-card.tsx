import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string;
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * Stat card for displaying metrics with neo-brutalist style
 * Used in Stats/Hero sections
 */
export function StatCard({ 
  value, 
  label, 
  variant = 'secondary',
  className 
}: StatCardProps) {
  const shadowColor = variant === 'primary' ? '#00A8E8' : '#FFE066';
  
  return (
    <div 
      className={cn(
        "bg-white p-6 rounded-2xl border-3 border-black text-center",
        className
      )}
      style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
    >
      <div className="text-4xl font-heading mb-2 text-[#00A8E8]">
        {value}
      </div>
      <div className="text-text-secondary text-sm">
        {label}
      </div>
    </div>
  );
}
