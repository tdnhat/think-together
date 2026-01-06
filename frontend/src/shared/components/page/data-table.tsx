import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { LoadingState } from "./loading-state";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
    /**
     * Unique key for the column
     */
    key: string;

    /**
     * Header label
     */
    header: string;

    /**
     * Cell renderer function
     */
    cell: (item: T) => React.ReactNode;

    /**
     * Optional header className
     */
    headerClassName?: string;

    /**
     * Optional cell className
     */
    cellClassName?: string;
}

export interface DataTableProps<T> {
    /**
     * Data array to display
     */
    data: T[];

    /**
     * Column configuration
     */
    columns: DataTableColumn<T>[];

    /**
     * Loading state
     */
    isLoading?: boolean;

    /**
     * Empty state component to display when no data
     */
    emptyState?: React.ReactNode;

    /**
     * Optional row click handler
     */
    onRowClick?: (item: T) => void;

    /**
     * Get unique key for each row
     */
    getRowKey: (item: T) => string;

    /**
     * Additional className for table container
     */
    className?: string;
}

/**
 * Generic data table component with column configuration.
 * 
 * Provides standardized table display with:
 * - Type-safe column configuration
 * - Custom cell rendering
 * - Built-in loading state
 * - Built-in empty state
 * - Optional row click handling
 * 
 * @example
 * <DataTable
 *   data={users}
 *   columns={[
 *     {
 *       key: 'name',
 *       header: 'Name',
 *       cell: (user) => `${user.firstName} ${user.lastName}`
 *     },
 *     {
 *       key: 'email',
 *       header: 'Email',
 *       cell: (user) => user.email
 *     }
 *   ]}
 *   getRowKey={(user) => user.id}
 *   isLoading={isLoading}
 *   emptyState={<EmptyState ... />}
 * />
 */
export function DataTable<T>({
    data,
    columns,
    isLoading = false,
    emptyState,
    onRowClick,
    getRowKey,
    className,
}: DataTableProps<T>) {
    // Loading state
    if (isLoading) {
        return <LoadingState />;
    }

    // Empty state
    if (data.length === 0 && emptyState) {
        return <>{emptyState}</>;
    }

    return (
        <div className={cn("rounded-md border", className)}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key}
                                className={column.headerClassName}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                Không có dữ liệu
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow
                                key={getRowKey(item)}
                                onClick={onRowClick ? () => onRowClick(item) : undefined}
                                className={onRowClick ? "cursor-pointer" : undefined}
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        className={column.cellClassName}
                                    >
                                        {column.cell(item)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
