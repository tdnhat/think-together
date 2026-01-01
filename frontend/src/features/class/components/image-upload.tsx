'use client'

import { useRef, useState } from 'react'
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { useImageUpload } from '@/lib/hooks'
import { uploadCoverImage, uploadCoverImageTemp } from '../api/class.service'
import type { ClassDto } from '../types'

interface ClassImageUploadProps {
    classId?: string
    currentImageUrl?: string
    onUploadSuccess?: (updatedClass: ClassDto) => void
    onUploadSuccessTemp?: (imageUrl: string) => void
    onError?: (error: string) => void
    disabled?: boolean
    className?: string
}

export function ImageUpload({
    classId,
    currentImageUrl,
    onUploadSuccess,
    onUploadSuccessTemp,
    onError,
    disabled = false,
    className = '',
}: ClassImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
    const [showPreview, setShowPreview] = useState(!!currentImageUrl)
    const isTempMode = !classId

    const { isUploading, uploadProgress, error, uploadImage, uploadImageTemp, clearError } = useImageUpload<ClassDto>({
        onSuccess: (updatedClass: ClassDto) => {
            setPreviewUrl(updatedClass.coverImageUrl || null)
            setShowPreview(!!updatedClass.coverImageUrl)
            onUploadSuccess?.(updatedClass)
        },
        onSuccessTemp: (imageUrl) => {
            setPreviewUrl(imageUrl)
            setShowPreview(true)
            onUploadSuccessTemp?.(imageUrl)
        },
        onError,
    })

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        clearError()

        // Create preview URL
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)
        setShowPreview(true)

        // Upload the file
        let result: ClassDto | string | null = null
        if (isTempMode) {
            result = await uploadImageTemp(file, (f) => uploadCoverImageTemp(f))
        } else if (classId) {
            result = await uploadImage(classId, file, (id, f) => uploadCoverImage(id, f))
        }

        // Clean up preview URL if upload failed
        if (!result) {
            URL.revokeObjectURL(objectUrl)
            setPreviewUrl(null)
            setShowPreview(false)
        } else if (isTempMode && typeof result === 'string') {
            // For temp upload, result is the image URL, preview is already set
            URL.revokeObjectURL(objectUrl)
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveImage = () => {
        setPreviewUrl(null)
        setShowPreview(false)
        clearError()
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleUploadClick = () => {
        if (!disabled && !isUploading) {
            fileInputRef.current?.click()
        }
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                disabled={disabled || isUploading}
                className="hidden"
                aria-label="Upload class cover image"
            />

            {/* Preview Section */}
            {showPreview && previewUrl && (
                <div className="relative">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-primary/20 bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewUrl}
                            alt="Cover preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                            }}
                        />

                        {/* Overlay with actions */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/40">
                            <div className="flex gap-2 opacity-0 transition-opacity hover:opacity-100">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="default"
                                    onClick={handleUploadClick}
                                    disabled={disabled || isUploading}
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={handleRemoveImage}
                                    disabled={disabled || isUploading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Upload Progress Overlay */}
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <div className="text-center">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-white" />
                                    <p className="mt-2 text-sm text-white">
                                        {uploadProgress}%
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Success indicator */}
                        {!isUploading && !error && currentImageUrl && previewUrl === currentImageUrl && (
                            <div className="absolute bottom-2 right-2">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!showPreview && (
                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary hover:bg-background">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                        Click để tải ảnh bìa
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        JPEG, PNG, WebP, GIF • Max 5MB
                    </p>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleUploadClick}
                        disabled={disabled || isUploading}
                        className="mt-4"
                    >
                        Chọn ảnh
                    </Button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <Alert variant="destructive" className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <AlertDescription className="flex-1">{error}</AlertDescription>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={clearError}
                        className="h-5 w-5"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </Alert>
            )}

            {/* Helper text */}
            <p className="text-xs text-muted-foreground">
                Hỗ trợ ảnh JPG, PNG. Tối đa 5MB.
            </p>
        </div>
    )
}
