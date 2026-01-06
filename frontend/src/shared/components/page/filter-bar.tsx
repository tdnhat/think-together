import { Search, Plus } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

export interface FilterBarProps {
    /**
     * Search placeholder text
     */
    searchPlaceholder?: string;

    /**
     * Search value
     */
    searchValue?: string;

    /**
     * Search change handler
     */
    onSearchChange?: (value: string) => void;

    /**
     * Optional filter controls (selects, checkboxes, etc.)
     */
    filters?: React.ReactNode;

    /**
     * Optional action button (e.g., "Create New")
     */
    action?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };

    /**
     * Additional className
     */
    className?: string;
}

/**
 * Standard filter bar with search and optional filters/actions.
 * 
 * Provides unified filter interface with:
 * - Search input with icon
 * - Optional filter controls
 * - Optional action button
 * - Responsive layout
 * 
 * @example
 * // Simple search only
 * <FilterBar
 *   searchPlaceholder="Search users..."
 *   searchValue={search}
 *   onSearchChange={setSearch}
 * />
 * 
 * @example
 * // With filters and action
 * <FilterBar
 *   searchPlaceholder="Search..."
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   filters={
 *     <>
 *       <Select>...</Select>
 *       <Select>...</Select>
 *     </>
 *   }
 *   action={{
 *     label: "Create New",
 *     onClick: handleCreate,
 *     icon: <Plus className="h-4 w-4" />
 *   }}
 * />
 */
export function FilterBar({
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    filters,
    action,
    className,
}: FilterBarProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
            {/* Search Input */}
            {onSearchChange && (
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        className="pl-10"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            )}

            {/* Filters and Action */}
            {(filters || action) && (
                <div className="flex gap-4 items-center">
                    {filters && <div className="flex gap-4">{filters}</div>}
                    {action && (
                        <Button onClick={action.onClick}>
                            {action.icon}
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
