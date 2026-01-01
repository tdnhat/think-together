'use client'

import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Button } from '@/shared/ui/button'
import { MoreHorizontal, Eye, Pencil, Ban } from 'lucide-react'
import { UserDto } from '@/types/api'
import { UserInfoModal } from './user-info-modal'
import { UserEditModal } from './user-edit-modal'
import { UserDeactivateDialog } from './user-deactivate-dialog'

interface UserActionsProps {
    user: UserDto
    onUpdate: () => void
}

export function UserActions({ user, onUpdate }: UserActionsProps) {
    const [showInfo, setShowInfo] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [showDeactivate, setShowDeactivate] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowInfo(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEdit(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDeactivate(true)} className="text-red-600 focus:text-red-600">
                        <Ban className="mr-2 h-4 w-4" />
                        Vô hiệu hóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UserInfoModal open={showInfo} onOpenChange={setShowInfo} user={user} />
            <UserEditModal open={showEdit} onOpenChange={setShowEdit} user={user} onSuccess={onUpdate} />
            <UserDeactivateDialog open={showDeactivate} onOpenChange={setShowDeactivate} user={user} onSuccess={onUpdate} />
        </>
    )
}
