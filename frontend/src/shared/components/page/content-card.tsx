import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/lib/utils";

export interface ContentCardProps {
    /**
     * Card title
     */
    title: string;

    /**
     * Optional card description
     */
    description?: string;

    /**
     * Card content
     */
    children: React.ReactNode;

    /**
     * Optional actions to display in header
     */
    actions?: React.ReactNode;

    /**
     * Additional className for customization
     */
    className?: string;

    /**
     * Additional className for content area
     */
    contentClassName?: string;
}

/**
 * Standardized card wrapper for page sections.
 * 
 * Provides consistent card structure with:
 * - Title and optional description
 * - Optional actions in header
 * - Automatic content spacing (space-y-6)
 * 
 * @example
 * <ContentCard
 *   title="Danh Sách Người Dùng"
 *   description="Xem và quản lý tất cả người dùng"
 * >
 *   <UserList />
 * </ContentCard>
 * 
 * @example
 * // With actions
 * <ContentCard
 *   title="Danh Mục"
 *   description="Quản lý danh mục"
 *   actions={<Button>Tạo mới</Button>}
 * >
 *   <CategoryList />
 * </ContentCard>
 */
export function ContentCard({
    title,
    description,
    children,
    actions,
    className,
    contentClassName,
}: ContentCardProps) {
    return (
        <Card className={className}>
            <CardHeader className={cn(actions && "flex flex-row items-start justify-between space-y-0 pb-4")}>
                <div className="space-y-1.5">
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </CardHeader>
            <CardContent className={cn("space-y-6", contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
}
