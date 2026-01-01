import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user-service'
import { GetUsersRequest } from '@/types/api'

export function useUsers(params: GetUsersRequest) {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => userService.getUsers(params),
    })
}
