import { useState, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { AlertCircle, X } from 'lucide-react'
import { FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { quizService } from '@/lib/api/services/quiz.service'
import { CreateQuestionFormData } from '@/lib/validators'

export function AudioFields() {
    const { control, watch, formState } = useFormContext<CreateQuestionFormData>()
    const audioUrl = watch('audioUrl')

    const [isUploadingAudio, setIsUploadingAudio] = useState(false)
    const [audioUploadError, setAudioUploadError] = useState<string | null>(null)
    const [audioUploadProgress, setAudioUploadProgress] = useState(0)
    const audioInputRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <FormField
                control={control}
                name="audioUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Tệp Âm thanh <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                            <div className="space-y-2">
                                {!audioUrl ? (
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isUploadingAudio
                                                ? 'border-primary bg-primary/10 cursor-wait'
                                                : 'border-border hover:border-primary cursor-pointer'
                                            }`}
                                        onClick={() => {
                                            if (!isUploadingAudio) {
                                                audioInputRef.current?.click()
                                            }
                                        }}
                                    >
                                        <input
                                            ref={audioInputRef}
                                            type="file"
                                            accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/flac,audio/webm,.mp3,.wav,.ogg,.m4a,.flac,.webm"
                                            className="hidden"
                                            disabled={isUploadingAudio}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setIsUploadingAudio(true)
                                                    setAudioUploadError(null)
                                                    setAudioUploadProgress(0)

                                                    try {
                                                        // Validate file size (max 20MB)
                                                        const maxSize = 20 * 1024 * 1024 // 20MB
                                                        if (file.size > maxSize) {
                                                            throw new Error('Kích thước file không được vượt quá 20MB')
                                                        }

                                                        // Simulate progress (since we don't have real progress from API)
                                                        const progressInterval = setInterval(() => {
                                                            setAudioUploadProgress((prev) => {
                                                                if (prev >= 90) {
                                                                    clearInterval(progressInterval)
                                                                    return 90
                                                                }
                                                                return prev + 10
                                                            })
                                                        }, 200)

                                                        // Upload file to Cloudinary via backend
                                                        const uploadedAudioUrl = await quizService.uploadAudio(file)

                                                        clearInterval(progressInterval)
                                                        setAudioUploadProgress(100)

                                                        // Small delay to show 100% progress
                                                        await new Promise(resolve => setTimeout(resolve, 300))

                                                        field.onChange(uploadedAudioUrl)
                                                        setAudioUploadError(null)
                                                    } catch (error) {
                                                        console.error('Upload error:', error)
                                                        const errorMessage = error instanceof Error
                                                            ? error.message
                                                            : 'Tải âm thanh lên thất bại. Vui lòng thử lại.'
                                                        setAudioUploadError(errorMessage)
                                                        setAudioUploadProgress(0)
                                                    } finally {
                                                        setIsUploadingAudio(false)
                                                        // Reset progress after a delay
                                                        setTimeout(() => setAudioUploadProgress(0), 500)
                                                    }
                                                }
                                            }}
                                        />
                                        {isUploadingAudio ? (
                                            <div className="space-y-3">
                                                <LoadingSpinner size="md" className="mx-auto" />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-foreground">
                                                        Đang tải lên...
                                                    </p>
                                                    {/* Progress Bar */}
                                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary to-primary/20 transition-all duration-300 ease-out"
                                                            style={{ width: `${audioUploadProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {audioUploadProgress}% hoàn thành
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm text-foreground">
                                                    Nhấp để chọn tệp âm thanh
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Hỗ trợ: MP3, WAV, OGG, M4A, FLAC, WebM (tối đa 20MB)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-muted rounded-lg border border-border p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-foreground">
                                                Tệp đã tải lên
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => field.onChange('')}
                                            >
                                                Thay đổi
                                            </Button>
                                        </div>
                                        <audio
                                            controls
                                            className="w-full mt-2"
                                        >
                                            <source src={audioUrl} />
                                            Trình duyệt của bạn không hỗ trợ phát âm thanh HTML5.
                                        </audio>
                                    </div>
                                )}

                                {/* Error Message */}
                                {audioUploadError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Lỗi tải lên</AlertTitle>
                                        <AlertDescription className="flex items-center justify-between">
                                            <span>{audioUploadError}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => setAudioUploadError(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="audioTimestamp"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Thời gian bắt đầu âm thanh (giây)
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                className={formState.errors.audioTimestamp ? 'border-destructive' : ''}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </FormControl>
                        <FormDescription>
                            Âm thanh sẽ bắt đầu từ thời gian này (tính bằng giây). Ví dụ: 120 = 2 phút
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}
