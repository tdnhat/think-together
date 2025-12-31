'use client'

import { ArrowLeft, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import ImageCard from '@/shared/ui/image-card'
import { QUIZ_SET_CONSTANTS } from '../constants'
import type { QuizSetDto } from '@/types/api'

interface QuizDetailHeaderProps {
  quizSet: QuizSetDto
  onBack: () => void
}

export function QuizDetailHeader({ quizSet, onBack }: QuizDetailHeaderProps) {
  const coverImage = quizSet.coverImageUrl || QUIZ_SET_CONSTANTS.DEFAULTS.COVER_IMAGE

  return (
    <>
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-heading text-xl font-bold text-foreground">
          Chi tiết bộ trắc nghiệm
        </h1>
      </div>

      {/* Cover and Title Section */}
      <ImageCard
        imageUrl={coverImage}
        imageAlt={quizSet.title}
        aspectRatio="h-48 sm:h-64"
        className="overflow-hidden"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              {quizSet.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {quizSet.isPublished ? (
                <Badge variant="default" className="bg-green-400 text-black">Đã xuất bản</Badge>
              ) : (
                <Badge variant="outline">Bản nháp</Badge>
              )}
              <Badge variant="outline" className="text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(quizSet.createdAt), 'dd/MM/yyyy', { locale: vi })}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-heading text-lg font-bold">Mô tả</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {quizSet.description || 'Chưa có mô tả cho bộ trắc nghiệm này.'}
            </p>
          </div>
        </div>
      </ImageCard>
    </>
  )
}
