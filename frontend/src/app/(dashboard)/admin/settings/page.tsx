'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export default function SettingsAdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Cài Đặt Hệ Thống
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Cấu hình các cài đặt chung của hệ thống.
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài Đặt Chung</CardTitle>
          <CardDescription>
            Tính năng này đang được phát triển
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="site-name">Tên Trang Web</Label>
            <Input
              id="site-name"
              placeholder="ThinkTogether"
              disabled
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="site-description">Mô Tả</Label>
            <Input
              id="site-description"
              placeholder="Nền tảng học tập thông minh"
              disabled
              className="mt-2"
            />
          </div>
          <Button disabled>Lưu Cài Đặt</Button>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài Đặt Nâng Cao</CardTitle>
          <CardDescription>
            Tính năng này đang được phát triển
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-[var(--text-secondary)]">
              Cài đặt nâng cao sẽ sớm có sẵn
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
