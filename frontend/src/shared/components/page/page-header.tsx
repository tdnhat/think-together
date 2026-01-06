import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
    /**
     * Page title
     */
    title: string;

    /**
     * Optional page description
     */
    description?: string;

    /**
     * Optional icon to display before title
     */
    icon?: LucideIcon;

    /**
     * Optional actions to display on the right
     */
    actions?: React.ReactNode;

    /**
     * Additional className for customization
     */
    className?: string;
}

/**
 * Standard page header component with optional icon and actions.
 * 
 * Provides consistent styling across all dashboard pages with:
 * - Responsive typography (text-3xl sm:text-4xl)
 * - Optional icon with primary background
 * - Optional action buttons
 * - Semantic HTML structure
 * 
 * @example
 * // Simple header
 * <PageHeader
 *   title="Quản Lý Người Dùng"
 *   description="Quản lý tài khoản và quyền hạn"
 * />
 * 
 * @example
 * // Header with icon
 * <PageHeader
 *   icon={Users}
 *   title="Quản Lý Người Dùng"
 *   description="Quản lý tài khoản và quyền hạn"
 * />
 * 
 * @example
 * // Header with actions
 * <PageHeader
 *   title="Danh Sách Quiz"
 *   description="Xem và quản lý quiz"
 *   actions={<Button>Tạo mới</Button>}
 * />
 */
export function PageHeader({
    title,
    description,
    icon: Icon,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <section className={cn("space-y-4", className)}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="rounded-lg bg-primary p-2">
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                    )}
                    <div>
                        <h1 className="font-heading text-3xl font-bold sm:text-4xl text-foreground">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1 text-muted-foreground">{description}</p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </section>
    );
}
