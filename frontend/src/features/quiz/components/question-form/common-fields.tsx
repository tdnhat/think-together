import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
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
                        <Label>
                            Nội dung câu hỏi <span className="text-[var(--color-error)]">*</span>
                        </Label>
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
                        <Label>
                            Thời gian giới hạn (giây) <span className="text-[var(--color-error)]">*</span>
                        </Label>
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
                                        variant="neutral"
                                        size="sm"
                                        onClick={() => field.onChange(preset)}
                                        className={timeLimit === preset ? 'border-[var(--brand-primary)]' : ''}
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
