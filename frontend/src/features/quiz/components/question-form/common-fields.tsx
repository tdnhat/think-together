import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { QUESTION_CONSTANTS } from '../../constants'
import { CreateQuestionFormData } from '@/lib/validators'

export function CommonFields() {
    const { control, watch } = useFormContext<CreateQuestionFormData>()
    const timeLimit = watch('timeLimit')

    return (
        <>
            <FormField
                control={control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Nội dung câu hỏi <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder="Nhập nội dung câu hỏi..."
                                rows={3}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="timeLimit"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Thời gian giới hạn (giây) <span className="text-destructive">*</span>
                        </FormLabel>
                        <div className="flex gap-2">
                            <FormControl>
                                <Input
                                    type="number"
                                    min={QUESTION_CONSTANTS.TIME_LIMITS.MIN}
                                    max={QUESTION_CONSTANTS.TIME_LIMITS.MAX}
                                    className="w-32"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <div className="flex flex-wrap gap-2">
                                {QUESTION_CONSTANTS.TIME_LIMITS.PRESETS.map((preset) => (
                                    <Button
                                        key={preset}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => field.onChange(preset)}
                                        className={timeLimit === preset ? 'border-primary' : ''}
                                    >
                                        {preset}s
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}
