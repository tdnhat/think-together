'use client'

import { ArrowLeft, Settings, Eye } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'

interface QuizEditorHeaderProps {
    title: string
    description?: string
    isPublished: boolean
    onBack: () => void
    onSettings: () => void
    onPreview: () => void
}

export function QuizEditorHeader({
    title,
    description,
    isPublished,
    onBack,
    onSettings,
    onPreview,
}: Readonly<QuizEditorHeaderProps>) {
    return (
        <Card className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onBack}
                        className="shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground break-words">
                                {title}
                            </h1>
                            {isPublished ? (
                                <Badge variant="default" className="shrink-0">
                                    Đã xuất bản
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="shrink-0">
                                    Bản nháp
                                </Badge>
                            )}
                        </div>
                        {description && (
                            <p className="text-sm sm:text-base text-muted-foreground break-words">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Button variant="outline" size="icon" onClick={onSettings} className="shrink-0">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={onPreview} className="shrink-0">
                        <Eye className="h-4 w-4" />
                        Xem trước
                    </Button>
                </div>
            </div>
        </Card>
    )
}
