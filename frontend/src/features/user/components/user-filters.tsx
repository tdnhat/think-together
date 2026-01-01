'use client'

import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select'
import { UserRole } from '@/types/api'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { useEffect, useState } from 'react'
import { ROLE_LABELS } from '@/shared/utils/role-mapping'

interface UserFiltersProps {
    onSearchChange: (value: string) => void
    onRoleChange: (value: UserRole | 'all') => void
    onSortChange: (value: string) => void
}

export function UserFilters({ onSearchChange, onRoleChange, onSortChange }: UserFiltersProps) {
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearch = useDebounce(searchValue, 500)

    useEffect(() => {
        onSearchChange(debouncedSearch)
    }, [debouncedSearch, onSearchChange])

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm người dùng theo tên, email..."
                    className="pl-10"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                <Select onValueChange={(value) => onRoleChange(value as UserRole | 'all')}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chức vụ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả chức vụ</SelectItem>
                        <SelectItem value="User">{ROLE_LABELS.User}</SelectItem>
                        <SelectItem value="Creator">{ROLE_LABELS.Creator}</SelectItem>
                        <SelectItem value="Administrator">{ROLE_LABELS.Administrator}</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={onSortChange} defaultValue="newest">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="oldest">Cũ nhất</SelectItem>
                        <SelectItem value="name">Tên (A-Z)</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
