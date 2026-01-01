import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Plus } from 'lucide-react'

interface QuizFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    onFilterClick?: () => void
}

export function QuizFilters({
    searchTerm,
    onSearchChange,
    onFilterClick,
}: QuizFiltersProps) {
    return (
        <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
                <Input
                    placeholder="Tìm kiếm quiz..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="max-w-sm"
                />
                <Button variant="outline" onClick={onFilterClick}>
                    Lọc
                </Button>
            </div>
            {/* Add Create button if needed, though usually Quizzes are created in specific flows */}
        </div>
    )
}
