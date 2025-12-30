import { useFormContext } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { FormField, FormItem, FormControl, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Badge } from '@/shared/ui/badge'
import { QUESTION_CONSTANTS } from '../../constants'
import { CreateQuestionFormData } from '@/lib/validators'
import { QuestionType } from '@/types/api'

export function MatchingFields() {
    const { control, watch, setValue, formState } = useFormContext<CreateQuestionFormData>()
    const matchingPairs = watch('matchingPairs') || []

    const handleAddMatchingPair = () => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.MATCHING]
        if ('maxPairs' in typeInfo && matchingPairs.length < typeInfo.maxPairs) {
            const newPairs = [...matchingPairs, {
                id: crypto.randomUUID(),
                leftContent: '',
                rightContent: '',
                displayOrder: matchingPairs.length,
            }]
            setValue('matchingPairs', newPairs)
        }
    }

    const handleRemoveMatchingPair = (index: number) => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.MATCHING]
        const minPairs = 'minPairs' in typeInfo ? typeInfo.minPairs : 2
        if (matchingPairs.length > minPairs) {
            setValue('matchingPairs', matchingPairs.filter((_, idx) => idx !== index))
        }
    }

    const canAddMatchingPair = (() => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.MATCHING]
        return !('maxPairs' in typeInfo && matchingPairs.length >= typeInfo.maxPairs)
    })()

    const canRemoveMatchingPair = (() => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.MATCHING]
        const minPairs = 'minPairs' in typeInfo ? typeInfo.minPairs : 2
        return matchingPairs.length > minPairs
    })()

    return (
        <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>
                    Cặp ghép <span className="text-[var(--color-error)]">*</span>
                </Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMatchingPair}
                    disabled={!canAddMatchingPair}
                >
                    <Plus className="mr-1 h-4 w-4" />
                    Thêm cặp
                </Button>
            </div>

            <div className="space-y-2">
                {matchingPairs && matchingPairs.length > 0 ? (
                    matchingPairs.map((pair, index) => (
                        <div key={index} className="flex items-start gap-2 rounded-lg border border-[var(--border-secondary)] p-3">
                            <Badge variant="outline" className="mt-1 flex-shrink-0">
                                {index + 1}
                            </Badge>

                            <div className="flex flex-1 gap-2">
                                {/* Left Content */}
                                <FormField
                                    control={control}
                                    name={`matchingPairs.${index}.leftContent`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Nhập nội dung bên trái"
                                                    className={formState.errors.matchingPairs?.[index]?.leftContent ? 'border-[var(--color-error)]' : ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Connector */}
                                <div className="flex items-center px-2 text-[var(--text-tertiary)]">
                                    ↔
                                </div>

                                {/* Right Content */}
                                <FormField
                                    control={control}
                                    name={`matchingPairs.${index}.rightContent`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Nhập nội dung bên phải"
                                                    className={formState.errors.matchingPairs?.[index]?.rightContent ? 'border-[var(--color-error)]' : ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {canRemoveMatchingPair && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveMatchingPair(index)}
                                    className="mt-1 flex-shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))
                ) : null}

                {/* Show error message if validation fails */}
                {formState.errors.matchingPairs && typeof formState.errors.matchingPairs.message === 'string' && (
                    <p className="text-sm text-[var(--color-error)]">{formState.errors.matchingPairs.message}</p>
                )}
            </div>
        </FormItem>
    )
}
