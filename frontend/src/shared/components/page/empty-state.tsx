import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";

export interface EmptyStateProps {
    /**
     * Icon to display
     */
    icon: LucideIcon;

    /**
     * Title of the empty state
     */
    title: string;

    /**
     * Description text
     */
    description: string;

    /**
     * Optional action button
     */
    action?: {
        label: string;
        onClick: () => void;
        variant?: 'default' | 'outline' | 'secondary';
    };

    /**
     * Additional className for customization
     */
    className?: string;
}

/**
 * Standard empty state component.
 * 
 * Displays when lists or tables have no data.
 * Includes optional call-to-action button.
 * 
 * @example
 * <EmptyState
 *   icon={FileQuestion}
 *   title="Chưa có quiz nào"
 *   description="Bắt đầu bằng cách tạo quiz đầu tiên của bạn"
 *   action={{
 *     label: "Tạo quiz mới",
 *     onClick: handleCreate
 *   }}
 * />
 */
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center border-dashed border-2 border-border bg-muted/20 rounded-lg py-12 px-6 text-center",
            className
        )}>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
            </div>

            <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                {title}
            </h3>

            <p className="mb-6 max-w-sm text-muted-foreground">
                {description}
            </p>

            {action && (
                <Button
                    onClick={action.onClick}
                    variant={action.variant || 'default'}
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
