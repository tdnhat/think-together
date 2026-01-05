'use client'

import { Filter } from 'lucide-react'
import { SearchInput } from '@/shared/components'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select'
import { QUESTION_CONSTANTS } from '../constants'

interface QuestionListToolbarProps {
    searchQuery?: string
    onSearchChange?: (query: string) => void
    filterBy?: string
    onFilterChange?: (filter: string) => void
    className?: string
}

export function QuestionListToolbar({
    searchQuery = '',
    onSearchChange,
    filterBy = 'all',
    onFilterChange,
    className = '',
}: Readonly<QuestionListToolbarProps>) {
    return (
        <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
            {/* Search */}
            <SearchInput
                className="flex-1"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(value) => onSearchChange?.(value)}
                iconColor="text-primary"
            />

            {/* Filter Select */}
            <Select value={filterBy} onValueChange={onFilterChange}>
                <SelectTrigger className="w-auto gap-2 bg-secondary-background border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                    <Filter className="h-4 w-4 text-secondary" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    {Object.entries(QUESTION_CONSTANTS.TYPES).map(([type, info]) => (
                        <SelectItem key={type} value={type}>
                            {info.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
