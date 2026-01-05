'use client'

import { Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { SearchInput } from '@/shared/components'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'

interface QuizSetListToolbarProps {
    searchQuery: string
    onSearchChange?: (query: string) => void
    sortBy: 'newest' | 'oldest' | 'title' | 'questions'
    onSortChange?: (sort: 'newest' | 'oldest' | 'title' | 'questions') => void
    filterBy: 'all' | 'published' | 'draft'
    onFilterChange?: (filter: 'all' | 'published' | 'draft') => void
    className?: string
}

export function QuizSetListToolbar({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    filterBy,
    onFilterChange,
    className = '',
}: Readonly<QuizSetListToolbarProps>) {
    return (
        <div className={`flex flex-col gap-4 md:flex-row md:items-center ${className}`}>
            {/* Search */}
            <SearchInput
                className="flex-1 max-w-md"
                placeholder="Tìm kiếm bộ trắc nghiệm..."
                value={searchQuery}
                onChange={(value) => onSearchChange?.(value)}
                iconColor="text-muted-foreground"
            />

            {/* Sort and Filter */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-36 justify-between">
                                {sortBy === 'newest' && 'Mới nhất'}
                                {sortBy === 'oldest' && 'Cũ nhất'}
                                {sortBy === 'title' && 'Tên A-Z'}
                                {sortBy === 'questions' && 'Số câu hỏi'}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSortChange?.('newest')}>
                                Mới nhất
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange?.('oldest')}>
                                Cũ nhất
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange?.('title')}>
                                Tên A-Z
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange?.('questions')}>
                                Số câu hỏi
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-36 justify-between">
                            {filterBy === 'all' && 'Tất cả'}
                            {filterBy === 'published' && 'Đã xuất bản'}
                            {filterBy === 'draft' && 'Nháp'}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onFilterChange?.('all')}>
                            Tất cả
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onFilterChange?.('published')}>
                            Đã xuất bản
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onFilterChange?.('draft')}>
                            Nháp
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
