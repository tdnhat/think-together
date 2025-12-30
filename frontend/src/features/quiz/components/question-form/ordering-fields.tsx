import { useFormContext } from 'react-hook-form'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { FormField, FormItem, FormControl, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Badge } from '@/shared/ui/badge'
import { QUESTION_CONSTANTS } from '../../constants'
import { CreateQuestionFormData } from '@/lib/validators'
import { QuestionType } from '@/types/api'

export function OrderingFields() {
    const { control, watch, setValue, formState } = useFormContext<CreateQuestionFormData>()
    const orderingItems = watch('orderingItems') || []

    const handleAddOrderingItem = () => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.ORDERING]
        if ('maxItems' in typeInfo && orderingItems.length < typeInfo.maxItems) {
            const newItems = [...orderingItems, {
                id: crypto.randomUUID(),
                content: '',
                correctPosition: orderingItems.length,
            }]
            setValue('orderingItems', newItems)
        }
    }

    const handleRemoveOrderingItem = (index: number) => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.ORDERING]
        const minItems = 'minItems' in typeInfo ? typeInfo.minItems : 3
        if (orderingItems.length > minItems) {
            const newItems = orderingItems.filter((_, idx) => idx !== index)
            // Update correctPosition for remaining items
            const updatedItems = newItems.map((item, idx) => ({ ...item, correctPosition: idx }))
            setValue('orderingItems', updatedItems)
        }
    }

    const handleMoveOrderingItem = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === orderingItems.length - 1)) {
            return
        }

        const newItems = [...orderingItems]
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update correctPosition
        const updatedItems = newItems.map((item, idx) => ({ ...item, correctPosition: idx }))
        setValue('orderingItems', updatedItems)
    }

    const canAddOrderingItem = (() => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.ORDERING]
        return !('maxItems' in typeInfo && orderingItems.length >= typeInfo.maxItems)
    })()

    const canRemoveOrderingItem = (() => {
        const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.ORDERING]
        const minItems = 'minItems' in typeInfo ? typeInfo.minItems : 3
        return orderingItems.length > minItems
    })()

    return (
        <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <Label>
                        Mục để sắp xếp <span className="text-[var(--color-error)]">*</span>
                    </Label>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        Nhập các mục theo thứ tự đúng. Người chơi sẽ phải sắp xếp chúng theo thứ tự này.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOrderingItem}
                    disabled={!canAddOrderingItem}
                >
                    <Plus className="mr-1 h-4 w-4" />
                    Thêm mục
                </Button>
            </div>

            <div className="space-y-2">
                {orderingItems && orderingItems.length > 0 ? (
                    orderingItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 rounded-lg border border-[var(--border-secondary)] p-3">
                            <Badge variant="outline" className="mt-1 flex-shrink-0 min-w-fit">
                                {index + 1}
                            </Badge>

                            <FormField
                                control={control}
                                name={`orderingItems.${index}.content`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={`Nhập mục ${index + 1}`}
                                                className={formState.errors.orderingItems?.[index]?.content ? 'border-[var(--color-error)]' : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-1 flex-shrink-0">
                                {/* Move Up */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveOrderingItem(index, 'up')}
                                    disabled={index === 0}
                                    title="Dịch lên"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>

                                {/* Move Down */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveOrderingItem(index, 'down')}
                                    disabled={index === orderingItems.length - 1}
                                    title="Dịch xuống"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>

                                {/* Remove */}
                                {canRemoveOrderingItem && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleRemoveOrderingItem(index)}
                                        title="Xóa"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : null}

                {/* Show error message if validation fails */}
                {formState.errors.orderingItems && typeof formState.errors.orderingItems.message === 'string' && (
                    <p className="text-sm text-[var(--color-error)]">{formState.errors.orderingItems.message}</p>
                )}
            </div>
        </FormItem>
    )
}
