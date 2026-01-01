import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Plus } from 'lucide-react'

interface CategoryFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    onCreateClick: () => void
}

export function CategoryFilters({
    searchTerm,
    onSearchChange,
    onCreateClick,
}: CategoryFiltersProps) {
    return (
        <div className="flex justify-between items-center gap-4">
            <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="max-w-sm"
            />
            <Button onClick={onCreateClick}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Danh Mục
            </Button>
        </div>
    )
}
