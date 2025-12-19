'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { CLASS_CONSTANTS } from '../constants'
import type { ClassDto, CreateClassRequest, UpdateClassRequest } from '../types'

interface ClassFormProps {
  classData?: ClassDto | null
  onSubmit: (data: CreateClassRequest | UpdateClassRequest) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
}

export function ClassForm({
  classData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}: Readonly<ClassFormProps>) {
  const [name, setName] = useState(classData?.name || '')
  const [description, setDescription] = useState(classData?.description || '')
  const [coverImageUrl, setCoverImageUrl] = useState(classData?.coverImageUrl || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data: CreateClassRequest | UpdateClassRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      coverImageUrl: coverImageUrl.trim() || undefined,
    }

    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {classData ? 'Chỉnh sửa lớp học' : 'Tạo lớp học mới'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên lớp học <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={CLASS_CONSTANTS.PLACEHOLDERS.NAME}
              maxLength={CLASS_CONSTANTS.LIMITS.NAME_MAX_LENGTH}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-[var(--text-secondary)]">
              {name.length} / {CLASS_CONSTANTS.LIMITS.NAME_MAX_LENGTH} ký tự
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={CLASS_CONSTANTS.PLACEHOLDERS.DESCRIPTION}
              maxLength={CLASS_CONSTANTS.LIMITS.DESCRIPTION_MAX_LENGTH}
              rows={4}
              disabled={isSubmitting}
            />
            <p className="text-xs text-[var(--text-secondary)]">
              {description.length} / {CLASS_CONSTANTS.LIMITS.DESCRIPTION_MAX_LENGTH} ký tự
            </p>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">URL hình ảnh bìa</Label>
            <Input
              id="coverImageUrl"
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
            {coverImageUrl && (
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border-2 border-border">
                <img
                  src={coverImageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1"
            >
              {isSubmitting ? 'Đang lưu...' : classData ? 'Cập nhật' : 'Tạo lớp học'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="neutral"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
