'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { UserFilters } from '@/features/user/components/user-filters'
import { UserList } from '@/features/user/components/user-list'
import { useUsers } from '@/features/user/hooks/use-users'
import { useState } from 'react'
import { UserRole } from '@/types/api'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

export default function UsersAdminPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<UserRole | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'email'>('newest')

  const { data, isLoading, refetch } = useUsers({
    page,
    pageSize,
    search,
    role,
    sortBy,
  })

  // Calculations for pagination
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0
  const showPagination = totalPages > 1

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page on search
  }

  const handleRoleChange = (value: UserRole | 'all') => {
    setRole(value === 'all' ? undefined : value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value as 'newest' | 'oldest' | 'name' | 'email')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Quản Lý Người Dùng
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý tài khoản, quyền hạn, và hoạt động của người dùng.
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Người Dùng</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UserFilters
            onSearchChange={handleSearchChange}
            onRoleChange={handleRoleChange}
            onSortChange={handleSortChange}
          />

          <UserList users={data?.data || []} isLoading={isLoading} onUpdate={refetch} />

          {showPagination && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 1) setPage(page - 1)
                    }}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(i + 1)
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (page < totalPages) setPage(page + 1)
                    }}
                    className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
