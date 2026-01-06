import { cn } from "@/lib/utils";

export interface PageContainerProps {
    /**
     * Content to render inside the container
     */
    children: React.ReactNode;

    /**
     * Maximum width of the container
     * @default 'full'
     */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

    /**
     * Additional className for customization
     */
    className?: string;
}

const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
} as const;

/**
 * Standard page container with consistent spacing.
 * 
 * Provides:
 * - Consistent vertical spacing (space-y-6)
 * - Optional max-width constraints
 * - Responsive padding
 * 
 * @example
 * <PageContainer>
 *   <PageHeader title="..." />
 *   <ContentCard>...</ContentCard>
 * </PageContainer>
 */
export function PageContainer({
    children,
    maxWidth = 'full',
    className,
}: PageContainerProps) {
    return (
        <div className={cn(
            "space-y-6",
            maxWidth !== 'full' && 'mx-auto',
            maxWidthClasses[maxWidth],
            className
        )}>
            {children}
        </div>
    );
}
