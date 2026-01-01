import { api } from '@/lib/api/client'
import { GetUsersRequest, PaginatedResponse, UserDto, UpdateUserRequest } from '@/types/api'

export const userService = {
    getUsers: async (params: GetUsersRequest) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return api.get<PaginatedResponse<UserDto>>('/api/users', { params } as any)
    },

    getById: async (id: string) => {
        return api.get<UserDto>(`/api/users/${id}`)
    },

    update: async (data: UpdateUserRequest) => {
        return api.put<UserDto>(`/api/users/${data.id}`, data)
    },

    deactivate: async (id: string) => {
        return api.delete(`/api/users/${id}`)
    },
}
