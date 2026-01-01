import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
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
                        <FormLabel>
                            URL Video <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                                className={formState.errors.videoUrl ? 'border-destructive' : ''}
                            />
                        </FormControl>
                        <FormDescription>
                            Hỗ trợ YouTube URLs. Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="videoTimestamp"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Thời gian bắt đầu video (giây)
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                className={formState.errors.videoTimestamp ? 'border-destructive' : ''}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </FormControl>
                        <FormDescription>
                            Video sẽ bắt đầu từ thời gian này (tính bằng giây). Ví dụ: 120 = 2 phút
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Video Preview */}
            {videoUrl && (
                <div className="bg-muted rounded-lg border border-border p-4">
                    <p className="text-sm font-medium text-foreground mb-2">Xem trước video:</p>
                    <div className="bg-black rounded aspect-video flex items-center justify-center">
                        <p className="text-white text-sm">
                            Video preview sẽ được hiển thị tại đây
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {videoUrl}
                        {videoTimestamp && videoTimestamp > 0 && ` (bắt đầu từ ${videoTimestamp}s)`}
                    </p>
                </div>
            )}
        </>
    )
}
