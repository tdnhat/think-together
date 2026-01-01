
import { ROLE_LABELS } from '@/shared/utils/role-mapping'

import { UserDto, UserRole, UpdateUserRequest } from '@/types/api'
import { Button } from '@/shared/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user-service'
import { toast } from 'sonner'
import { useEffect } from 'react'

interface UserEditModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserDto
    onSuccess: () => void
}

export function UserEditModal({ open, onOpenChange, user, onSuccess }: UserEditModalProps) {
    const { register, handleSubmit, reset, setValue } = useForm<UpdateUserRequest>()
    const queryClient = useQueryClient()

    const updateMutation = useMutation({
        mutationFn: userService.update,
        onSuccess: () => {
            toast.success('Cập nhật người dùng thành công')
            queryClient.invalidateQueries({ queryKey: ['users'] })
            onSuccess()
            onOpenChange(false)
        },
        onError: () => {
            toast.error('Cập nhật thất bại')
        }
    })

    useEffect(() => {
        if (open && user) {
            setValue('id', user.id)
            setValue('firstName', user.firstName)
            setValue('lastName', user.lastName)
            setValue('role', user.role)
            setValue('bio', user.bio || '')
        }
    }, [open, user, setValue])


    const onSubmit = (data: UpdateUserRequest) => {
        updateMutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin cá nhân và vai trò
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <input type="hidden" {...register('id')} />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Họ</Label>
                            <Input id="firstName" {...register('firstName', { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Tên</Label>
                            <Input id="lastName" {...register('lastName', { required: true })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select onValueChange={(val: UserRole) => setValue('role', val)} defaultValue={user.role}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="User">{ROLE_LABELS.User}</SelectItem>
                                <SelectItem value="Creator">{ROLE_LABELS.Creator}</SelectItem>
                                <SelectItem value="Administrator">{ROLE_LABELS.Administrator}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" {...register('bio')} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
