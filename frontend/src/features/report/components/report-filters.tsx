import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

interface ReportFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    onFilterClick?: () => void
}

export function ReportFilters({
    searchTerm,
    onSearchChange,
    onFilterClick,
}: ReportFiltersProps) {
    return (
        <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
                <Input
                    placeholder="Tìm kiếm báo cáo..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="max-w-sm"
                />
                <Button variant="outline" onClick={onFilterClick}>
                    Lọc
                </Button>
            </div>
        </div>
    )
}
