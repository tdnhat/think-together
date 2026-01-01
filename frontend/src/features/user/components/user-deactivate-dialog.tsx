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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user-service'
import { toast } from 'sonner'

interface UserDeactivateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserDto
    onSuccess: () => void
}

export function UserDeactivateDialog({ open, onOpenChange, user, onSuccess }: UserDeactivateDialogProps) {
    const queryClient = useQueryClient()

    const deactivateMutation = useMutation({
        mutationFn: userService.deactivate,
        onSuccess: () => {
            toast.success('Đã vô hiệu hóa người dùng')
            queryClient.invalidateQueries({ queryKey: ['users'] })
            onSuccess()
            onOpenChange(false)
        },
        onError: () => {
            toast.error('Thao tác thất bại')
        }
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Vô hiệu hóa người dùng?</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc muốn vô hiệu hóa <strong>{user.firstName} {user.lastName}</strong>?
                        Họ sẽ không thể đăng nhập vào hệ thống nữa.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button
                        variant="destructive"
                        onClick={() => deactivateMutation.mutate(user.id)}
                        disabled={deactivateMutation.isPending}
                    >
                        {deactivateMutation.isPending ? 'Đang xử lý...' : 'Vô hiệu hóa'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
