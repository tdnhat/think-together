import { type LucideIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

export interface ErrorStateProps {
    /**
     * Icon to display
     * @default AlertCircle
     */
    icon?: LucideIcon;

    /**
     * Title of the error state
     */
    title: string;

    /**
     * Description or error message
     */
    description: string;

    /**
     * Optional retry/action button
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

    /**
     * Variant for different error severity levels
     * @default 'error'
     */
    variant?: 'error' | 'warning' | 'info';
}

/**
 * Standard error state component.
 * 
 * Displays when operations fail or errors occur.
 * Includes optional retry/action button.
 * 
 * @example
 * <ErrorState
 *   title="Không thể tải dữ liệu"
 *   description="Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại."
 *   action={{
 *     label: "Thử lại",
 *     onClick: handleRetry
 *   }}
 * />
 * 
 * @example
 * // Warning variant
 * <ErrorState
 *   variant="warning"
 *   title="Phiên đã hết hạn"
 *   description="Vui lòng đăng nhập lại để tiếp tục"
 * />
 */
export function ErrorState({
    icon: Icon = AlertCircle,
    title,
    description,
    action,
    className,
    variant = 'error',
}: ErrorStateProps) {
    const variantStyles = {
        error: {
            card: "border-red-200 bg-red-50",
            icon: "bg-red-100 text-red-600",
            title: "text-red-900",
            description: "text-red-700",
        },
        warning: {
            card: "border-orange-200 bg-orange-50",
            icon: "bg-orange-100 text-orange-600",
            title: "text-orange-900",
            description: "text-orange-700",
        },
        info: {
            card: "border-blue-200 bg-blue-50",
            icon: "bg-blue-100 text-blue-600",
            title: "text-blue-900",
            description: "text-blue-700",
        },
    };

    const styles = variantStyles[variant];

    return (
        <Card className={cn(styles.card, className)}>
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className={cn(
                    "mb-4 flex h-16 w-16 items-center justify-center rounded-full",
                    styles.icon
                )}>
                    <Icon className="h-8 w-8" />
                </div>

                <h3 className={cn(
                    "mb-2 font-heading text-xl font-semibold",
                    styles.title
                )}>
                    {title}
                </h3>

                <p className={cn(
                    "mb-6 max-w-sm",
                    styles.description
                )}>
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
            </CardContent>
        </Card>
    );
}
