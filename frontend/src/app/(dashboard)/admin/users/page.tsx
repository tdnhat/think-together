'use client'

import { Users } from 'lucide-react'
import { useState } from 'react'
import { UserActions } from '@/features/user/components/user-actions'
import { useUsers } from '@/features/user/hooks/use-users'
import { UserRole, UserDto } from '@/types/api'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Badge } from '@/shared/ui/badge'
import { DashboardLayout } from '@/widgets/dashboard'
import { PageHeader, PageContainer, ContentCard, FilterBar, EmptyState, DataTable } from '@/shared/components/page'
import { ROLE_LABELS, getRoleLabel } from '@/shared/utils/role-mapping'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

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
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          icon={Users}
          title="Quản Lý Người Dùng"
          description="Quản lý tài khoản, quyền hạn, và hoạt động của người dùng."
        />

        <ContentCard
          title="Danh Sách Người Dùng"
          description="Xem và quản lý tất cả người dùng trong hệ thống"
        >
          <FilterBar
            searchPlaceholder="Tìm kiếm người dùng theo tên, email..."
            searchValue={search}
            onSearchChange={handleSearchChange}
            filters={
              <>
                <Select onValueChange={(value) => handleRoleChange(value as UserRole | 'all')}>
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

                <Select onValueChange={handleSortChange} defaultValue="newest">
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
              </>
            }
          />

          <DataTable<UserDto>
            data={data?.data || []}
            columns={[
              {
                key: 'name',
                header: 'Tên',
                cell: (user) => (
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                ),
              },
              {
                key: 'email',
                header: 'Email',
                cell: (user) => user.email,
              },
              {
                key: 'role',
                header: 'Chức vụ',
                cell: (user) => (
                  <div className="flex gap-2 justify-center">
                    <Badge variant={user.role === 'Administrator' ? 'destructive' : user.role === 'Creator' ? 'default' : 'secondary'}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                ),
                headerClassName: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'createdAt',
                header: 'Ngày tham gia',
                cell: (user) => (
                  user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi }) : '-'
                ),
                headerClassName: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'status',
                header: 'Trạng thái',
                cell: (user) => (
                  <Badge
                    variant="outline"
                    className={user.isActive
                      ? "text-green-600 border-green-600 bg-green-50"
                      : "text-red-600 border-red-600 bg-red-50"}
                  >
                    {user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                  </Badge>
                ),
                headerClassName: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'actions',
                header: 'Hành động',
                cell: (user) => <UserActions user={user} onUpdate={refetch} />,
                headerClassName: 'text-right',
                cellClassName: 'text-right',
              },
            ]}
            getRowKey={(user) => user.id}
            isLoading={isLoading}
            emptyState={
              !isLoading && data?.data.length === 0 && search === '' && !role ? (
                <EmptyState
                  icon={Users}
                  title="Chưa có người dùng nào"
                  description="Hệ thống chưa có người dùng nào được đăng ký"
                />
              ) : (
                <EmptyState
                  icon={Users}
                  title="Không tìm thấy kết quả"
                  description="Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại"
                />
              )
            }
          />

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
        </ContentCard>
      </PageContainer>
    </DashboardLayout>
  )
}
