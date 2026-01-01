import { useFormContext, Controller } from 'react-hook-form'
import { Plus, Trash2, Check, X } from 'lucide-react'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { QUESTION_CONSTANTS } from '../../constants'
import { CreateQuestionFormData } from '@/lib/validators'
import { QuestionType } from '@/types/api'

export function OptionsFields() {
    const { control, watch, setValue, formState } = useFormContext<CreateQuestionFormData>()
    const type = watch('type') as QuestionType
    const options = watch('options') || []

    const handleAddOption = () => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[type]
        if ('maxOptions' in typeInfo && options.length < typeInfo.maxOptions) {
            const newOptions = [...(options || []), { content: '', isCorrect: false, displayOrder: (options?.length || 0) }]
            setValue('options', newOptions)
        }
    }

    const handleRemoveOption = (index: number) => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[type]
        const minOptions = 'minOptions' in typeInfo ? typeInfo.minOptions : 2
        if (options && options.length > minOptions) {
            setValue('options', options.filter((_, idx) => idx !== index))
        }
    }

    const handleOptionChange = (index: number, field: 'content' | 'isCorrect', value: string | boolean) => {
        const newOptions = [...(options || [])]

        if (field === 'isCorrect' && type === QuestionType.SINGLE_CHOICE) {
            // For single choice, only one option can be correct
            newOptions.forEach((opt, idx) => {
                opt.isCorrect = idx === index
            })
        } else {
            newOptions[index] = { ...newOptions[index], [field]: value }
        }

        setValue('options', newOptions)
    }

    const canAddOption = (() => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[type]
        return !('maxOptions' in typeInfo && options && options.length >= typeInfo.maxOptions)
    })()

    const canRemoveOption = (() => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[type]
        const minOptions = 'minOptions' in typeInfo ? typeInfo.minOptions : 2
        return options && options.length > minOptions
    })()

    return (
        <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
                <FormLabel>
                    Các lựa chọn <span className="text-destructive">*</span>
                </FormLabel>
                {type !== QuestionType.TRUE_FALSE && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddOption}
                        disabled={!canAddOption}
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        Thêm lựa chọn
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                {options && options.length > 0 ? (
                    options.map((option, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-2 flex-shrink-0">
                                {String.fromCharCode(65 + index)}
                            </Badge>

                            <FormField
                                control={control}
                                name={`options.${index}.content`}
                                render={({ field }) => (
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={`Nhập lựa chọn ${String.fromCharCode(65 + index)}`}
                                            className="flex-1"
                                        />
                                    </FormControl>
                                )}
                            />

                            <Controller
                                control={control}
                                name={`options.${index}.isCorrect`}
                                render={({ field }) => (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant={field.value ? 'default' : 'outline'}
                                                    size="icon"
                                                    onClick={() => {
                                                        if (type === QuestionType.SINGLE_CHOICE) {
                                                            // Manual logic is safest for radio behavior
                                                            if (!field.value) {
                                                                handleOptionChange(index, 'isCorrect', true)
                                                            }
                                                        } else {
                                                            field.onChange(!field.value)
                                                        }
                                                    }}
                                                >
                                                    {field.value ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {field.value ? 'Đáp án đúng' : 'Đánh dấu là đáp án đúng'}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            />

                            {canRemoveOption && type !== QuestionType.TRUE_FALSE && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveOption(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))
                ) : null}
            </div>

            {formState.errors.options && (
                <p className="text-sm text-destructive">
                    {typeof formState.errors.options.message === 'string' 
                        ? formState.errors.options.message 
                        : 'Vui lòng kiểm tra các lựa chọn của bạn'}
                </p>
            )}
        </FormItem>
    )
}
