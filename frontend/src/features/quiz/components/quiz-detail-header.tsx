'use client'

import { ArrowLeft, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import type { QuizSetDto } from '@/types/api'

interface QuizDetailHeaderProps {
  quizSet: QuizSetDto
  onBack: () => void
}

export function QuizDetailHeader({ quizSet, onBack }: QuizDetailHeaderProps) {
  return (
    <>
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button 
          variant="neutral" 
          size="icon" 
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-heading text-xl font-bold text-[var(--text-primary)]">
          Chi tiết bộ trắc nghiệm
        </h1>
      </div>

      {/* Cover and Title Section */}
      <Card className="overflow-hidden">
        {quizSet.coverImageUrl && (
          <div className="relative h-48 w-full bg-gray-100 sm:h-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={quizSet.coverImageUrl}
              alt={quizSet.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl">
                {quizSet.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {quizSet.isPublished ? (
                  <Badge variant="default" className="bg-green-400 text-black">Đã xuất bản</Badge>
                ) : (
                  <Badge variant="neutral">Bản nháp</Badge>
                )}
                <Badge variant="neutral" className="text-[var(--text-secondary)]">
                  <Calendar className="mr-1 h-3 w-3" />
                  {format(new Date(quizSet.createdAt), 'dd/MM/yyyy', { locale: vi })}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-heading text-lg font-bold">Mô tả</h3>
            <p className="text-[var(--text-secondary)] whitespace-pre-wrap">
              {quizSet.description || 'Chưa có mô tả cho bộ trắc nghiệm này.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
