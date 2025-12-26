import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormMessage } from '@/shared/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Label } from '@/shared/ui/label'
import { QUESTION_CONSTANTS } from '../../constants'
import { QuestionDto, QuestionType, CreateQuestionRequest } from '@/types/api'
import { CreateQuestionFormData } from '@/lib/validators'

interface QuestionTypeSelectProps {
    question?: QuestionDto | null
}

export function QuestionTypeSelect({ question }: QuestionTypeSelectProps) {
    const { control, watch } = useFormContext<CreateQuestionFormData>()
    const type = watch('type') as QuestionType

    return (
        <FormField
            control={control}
            name="type"
            render={({ field }) => (
                <FormItem>
                    <Label>Loại câu hỏi</Label>
                    <FormControl>
                        <Select value={field.value} onValueChange={field.onChange} disabled={!!question}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại câu hỏi" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(QUESTION_CONSTANTS.TYPES).map(([value, info]) => (
                                    <SelectItem key={value} value={value}>
                                        {info.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <p className="text-xs text-[var(--text-tertiary)]">
                        {QUESTION_CONSTANTS.TYPES[type]?.description}
                    </p>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
