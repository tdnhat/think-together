import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { CreateQuestionFormData } from '@/lib/validators'

export function VideoFields() {
    const { control, watch, formState } = useFormContext<CreateQuestionFormData>()
    const videoUrl = watch('videoUrl')
    const videoTimestamp = watch('videoTimestamp')

    return (
        <>
            <FormField
                control={control}
                name="videoUrl"
                render={({ field }) => (
                    <FormItem>
                        <Label>
                            URL Video <span className="text-[var(--color-error)]">*</span>
                        </Label>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                                className={formState.errors.videoUrl ? 'border-[var(--color-error)]' : ''}
                            />
                        </FormControl>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                            Hỗ trợ YouTube URLs. Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                        </p>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="videoTimestamp"
                render={({ field }) => (
                    <FormItem>
                        <Label>
                            Thời gian bắt đầu video (giây)
                        </Label>
                        <FormControl>
                            <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                className={formState.errors.videoTimestamp ? 'border-[var(--color-error)]' : ''}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </FormControl>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                            Video sẽ bắt đầu từ thời gian này (tính bằng giây). Ví dụ: 120 = 2 phút
                        </p>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Video Preview */}
            {videoUrl && (
                <div className="bg-[var(--bg-surface-secondary)] rounded-lg border border-[var(--border-secondary)] p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Xem trước video:</p>
                    <div className="bg-black rounded aspect-video flex items-center justify-center">
                        <p className="text-white text-sm">
                            Video preview sẽ được hiển thị tại đây
                        </p>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                        {videoUrl}
                        {videoTimestamp && videoTimestamp > 0 && ` (bắt đầu từ ${videoTimestamp}s)`}
                    </p>
                </div>
            )}
        </>
    )
}
