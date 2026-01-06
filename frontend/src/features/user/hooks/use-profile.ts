'use client'

import { useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { profileService } from '../services/profile-service'
import { handleError } from '@/lib/errors/error-handler'
import { toastSuccess } from '@/lib/utils/toast'
import type { UpdateProfileRequest } from '@/types/api'

export function useProfile() {
    const [isLoading, setIsLoading] = useState(false)
    const user = useAuthStore((state) => state.user)
    const { updateUser } = useAuthStore((state) => state.actions)

    const updateProfile = async (data: UpdateProfileRequest) => {
        try {
            setIsLoading(true)
            const updatedUser = await profileService.updateProfile(data)

            // Update the auth store with new user data
            if (updatedUser) {
                updateUser({
                    ...user!,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    name: `${updatedUser.firstName} ${updatedUser.lastName}`,
                    bio: updatedUser.bio,
                    avatarUrl: updatedUser.avatarUrl,
                })
                toastSuccess('Cập nhật hồ sơ thành công')
                return { success: true as const }
            }

            return {
                success: false as const,
                error: 'Không thể cập nhật hồ sơ',
            }
        } catch (error) {
            const handledError = handleError(error, {
                showToast: true,
            })

            return {
                success: false as const,
                error: handledError.message,
            }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        user,
        isLoading,
        updateProfile,
    }
}
