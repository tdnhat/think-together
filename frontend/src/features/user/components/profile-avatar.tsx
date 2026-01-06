'use client'

import { useState, useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { api } from '@/lib/api/client'
import { handleError } from '@/lib/errors/error-handler'
import { toastSuccess } from '@/lib/utils/toast'

interface ProfileAvatarProps {
    avatarUrl?: string | null
    userInitials: string
    onAvatarChange: (url: string) => void
}

export function ProfileAvatar({
    avatarUrl,
    userInitials,
    onAvatarChange,
}: ProfileAvatarProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            handleError(new Error('Kích thước file không được vượt quá 5MB'), {
                showToast: true,
            })
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            handleError(new Error('Vui lòng chọn file ảnh'), { showToast: true })
            return
        }

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('file', file)

            const response = await api.post<{ url: string }>(
                '/api/upload/image?folder=users/avatars',
                formData
            )

            if (response.url) {
                onAvatarChange(response.url)
                toastSuccess('Tải ảnh đại diện lên thành công')
            }
        } catch (error) {
            handleError(error, { showToast: true })
        } finally {
            setIsUploading(false)
            // Reset input to allow re-uploading the same file
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <Avatar className="h-32 w-32">
                    <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
                    <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <Upload className="h-4 w-4 animate-spin" />
                    ) : (
                        <Camera className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="text-center">
                <Label className="text-sm text-muted-foreground">
                    Nhấp vào biểu tượng máy ảnh để thay đổi ảnh đại diện
                </Label>
                <p className="text-xs text-muted-foreground">
                    JPG, PNG, hoặc GIF. Kích thước tối đa 5MB.
                </p>
            </div>
        </div>
    )
}
