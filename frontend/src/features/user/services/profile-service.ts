import { api } from '@/lib/api/client'
import { UpdateProfileRequest, UserDto } from '@/types/api'

export const profileService = {
    getCurrentProfile: async () => {
        return api.get<UserDto>('/api/users/me')
    },

    updateProfile: async (data: UpdateProfileRequest) => {
        return api.put<UserDto>('/api/users/me', data)
    },
}
