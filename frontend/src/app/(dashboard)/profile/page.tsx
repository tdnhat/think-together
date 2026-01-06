'use client'

import { User } from 'lucide-react'
import { DashboardLayout } from '@/widgets/dashboard'
import { ProfileForm } from '@/features/user/components/profile-form'

export default function ProfilePage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary p-2">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-heading text-3xl sm:text-4xl text-foreground">
                                Hồ Sơ Của Tôi
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Quản lý thông tin cá nhân và tùy chỉnh hồ sơ của bạn
                            </p>
                        </div>
                    </div>
                </section>

                {/* Profile Form */}
                <section>
                    <ProfileForm />
                </section>
            </div>
        </DashboardLayout>
    )
}
