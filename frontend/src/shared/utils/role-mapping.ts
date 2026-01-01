import { UserRole } from '@/types/api'

export const ROLE_LABELS: Record<UserRole, string> = {
    User: 'Người dùng',
    Creator: 'Nhà sáng tạo',
    Administrator: 'Quản trị viên',
}

export const getRoleLabel = (role: UserRole): string => {
    return ROLE_LABELS[role] || role
}
