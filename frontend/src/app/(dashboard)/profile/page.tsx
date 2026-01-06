'use client'

import { User } from 'lucide-react'
import { DashboardLayout } from '@/widgets/dashboard'
import { PageHeader, PageContainer } from '@/shared/components/page'
import { ProfileForm } from '@/features/user/components/profile-form'

export default function ProfilePage() {
    return (
        <DashboardLayout>
            <PageContainer>
                <PageHeader
                    icon={User}
                    title="Hồ Sơ Của Tôi"
                    description="Quản lý thông tin cá nhân và tùy chỉnh hồ sơ của bạn"
                />

                <ProfileForm />
            </PageContainer>
        </DashboardLayout>
    )
}
