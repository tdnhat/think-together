'use client'

import { UserDto } from '@/types/api'
import { Button } from '@/shared/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { getRoleLabel } from '@/shared/utils/role-mapping'

interface UserInfoModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserDto
}

export function UserInfoModal({ open, onOpenChange, user }: UserInfoModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thông tin người dùng</DialogTitle>
                    <DialogDescription>
                        Chi tiết về tài khoản người dùng
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatarUrl || ''} />
                            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${user.role === 'Administrator' ? 'bg-purple-100 text-purple-800' :
                                    user.role === 'Creator' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'
                                }`}>
                                {getRoleLabel(user.role)}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-sm font-medium">Trạng thái:</span>
                            <span className={`text-sm col-span-3 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                {user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                            </span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-sm font-medium">Xác thực:</span>
                            <span className="text-sm col-span-3">
                                {user.isEmailVerified ? 'Đã xác thực Email' : 'Chưa xác thực'}
                            </span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-sm font-medium">Bio:</span>
                            <span className="text-sm col-span-3">
                                {user.bio || 'Chưa cập nhật'}
                            </span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-sm font-medium">Ngày tạo:</span>
                            <span className="text-sm col-span-3">
                                {user.createdAt ? format(new Date(user.createdAt), 'dd MMMM yyyy, HH:mm', { locale: vi }) : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
