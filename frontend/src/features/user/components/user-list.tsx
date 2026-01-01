'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table'
import { Badge } from '@/shared/ui/badge'
import { UserDto } from '@/types/api'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { UserActions } from './user-actions'
import { getRoleLabel } from '@/shared/utils/role-mapping'

interface UserListProps {
    users: UserDto[]
    isLoading: boolean
    onUpdate: () => void
}

export function UserList({ users, isLoading, onUpdate }: UserListProps) {
    if (isLoading) {
        // ... (loading state)
    }
    // ... (empty state)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">Chức vụ</TableHead>
                        <TableHead className="text-center">Ngày tham gia</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <div className="flex gap-2 justify-center">
                                    <Badge variant={user.role === 'Administrator' ? 'destructive' : user.role === 'Creator' ? 'default' : 'secondary'}>
                                        {getRoleLabel(user.role)}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi }) : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant="outline" className={user.isActive
                                    ? "text-green-600 border-green-600 bg-green-50"
                                    : "text-red-600 border-red-600 bg-red-50"}>
                                    {user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <UserActions user={user} onUpdate={onUpdate} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
