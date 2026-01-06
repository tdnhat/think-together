import { LoadingSpinner } from "@/shared/ui/loading-spinner";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
    /**
     * Type of loading indicator
     * @default 'spinner'
     */
    variant?: 'spinner' | 'skeleton' | 'inline';

    /**
     * Size of the loading indicator
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Optional loading message
     */
    message?: string;

    /**
     * Number of skeleton lines (only for skeleton variant)
     * @default 3
     */
    skeletonLines?: number;

    /**
     * Additional className
     */
    className?: string;
}

/**
 * Consistent loading state component.
 * 
 * Provides unified loading indicators across the app:
 * - Spinner: Centered loading spinner
 * - Skeleton: Loading skeleton placeholder
 * - Inline: Inline spinner with optional message
 * 
 * @example
 * // Default spinner
 * <LoadingState />
 * 
 * @example
 * // With message
 * <LoadingState message="Đang tải dữ liệu..." />
 * 
 * @example
 * // Skeleton loader
 * <LoadingState variant="skeleton" skeletonLines={5} />
 * 
 * @example
 * // Inline loading
 * <LoadingState variant="inline" message="Đang xử lý..." />
 */
export function LoadingState({
    variant = 'spinner',
    size = 'md',
    message,
    skeletonLines = 3,
    className,
}: LoadingStateProps) {
    if (variant === 'spinner') {
        return (
            <div className={cn("flex flex-col items-center justify-center gap-4 py-12", className)}>
                <LoadingSpinner size={size} />
                {message && (
                    <p className="text-sm text-muted-foreground">{message}</p>
                )}
            </div>
        );
    }

    if (variant === 'skeleton') {
        return (
            <div className={cn("space-y-4", className)}>
                {Array.from({ length: skeletonLines }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className={cn(
                            "w-full",
                            size === 'sm' && "h-8",
                            size === 'md' && "h-12",
                            size === 'lg' && "h-16"
                        )}
                    />
                ))}
            </div>
        );
    }

    // Inline variant
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <LoadingSpinner size={size} />
            {message && (
                <p className="text-sm text-muted-foreground">{message}</p>
            )}
        </div>
    );
}
