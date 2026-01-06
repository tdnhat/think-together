'use client'

import { Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { DashboardLayout } from '@/widgets/dashboard'
import { PageHeader, PageContainer } from '@/shared/components/page'

export default function SettingsAdminPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          icon={Settings}
          title="Cài Đặt Hệ Thống"
          description="Cấu hình các cài đặt chung của hệ thống."
        />

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
              <p className="text-muted-foreground">
                Cài đặt nâng cao sẽ sớm có sẵn
              </p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  )
}
