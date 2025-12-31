'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Search } from 'lucide-react'

export default function UsersAdminPage() {
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

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Lọc
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Người Dùng</CardTitle>
          <CardDescription>
            Tính năng này đang được phát triển
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              Quản lý người dùng toàn hệ thống sẽ sớm có sẵn
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
