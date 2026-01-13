import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { cn } from '@/lib/utils'

export interface ChoiceOption {
    index: number
    content: string
}

interface AnswerChoiceListProps {
    options: ChoiceOption[]
    selectedIndexes: number[]
    isMultiple: boolean
    disabled?: boolean
    onSelect: (index: number) => void
    // Optional callbacks/props for styling "Correct/Incorrect" states (used in Challenge/Review)
    getVariant?: (index: number, isSelected: boolean) => 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive'
    getClassName?: (index: number, isSelected: boolean) => string
    getIndicatorStyle?: (index: number, isSelected: boolean) => string
}

export function AnswerChoiceList({
    options,
    selectedIndexes,
    isMultiple,
    disabled = false,
    onSelect,
    getVariant,
    getClassName,
    getIndicatorStyle
}: AnswerChoiceListProps) {

    const defaultGetVariant = (index: number, isSelected: boolean) => isSelected ? 'default' : 'outline'
    const defaultGetClassName = () => ''
    const defaultGetIndicatorStyle = (index: number, isSelected: boolean) => {
        if (isSelected) return isMultiple ? 'border-primary data-[state=checked]:bg-primary' : 'border-primary bg-primary'
        return isMultiple ? '' : 'border-border'
    }

    const resolveVariant = getVariant || defaultGetVariant
    const resolveClassName = getClassName || defaultGetClassName
    const resolveIndicatorStyle = getIndicatorStyle || defaultGetIndicatorStyle

    const handleClick = (index: number) => {
        if (disabled) return
        onSelect(index)
    }

    return (
        <div className="space-y-3">
            {options.map((option) => {
                const isSelected = selectedIndexes.includes(option.index)

                return (
                    <Button
                        key={option.index}
                        type="button"
                        variant={resolveVariant(option.index, isSelected)}
                        className={cn(
                            "w-full justify-start h-auto py-4 whitespace-normal text-left",
                            resolveClassName(option.index, isSelected)
                        )}
                        onClick={() => handleClick(option.index)}
                        disabled={disabled}
                    >
                        {isMultiple ? (
                            <>
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleClick(option.index)}
                                    className={resolveIndicatorStyle(option.index, isSelected)}
                                    disabled={disabled}
                                />
                                <span className="flex-1 ml-3">{option.content}</span>
                            </>
                        ) : (
                            <>
                                <span
                                    className={cn(
                                        "size-4 shrink-0 rounded-full border-2 bg-background inline-flex items-center justify-center mr-3",
                                        isSelected ? "border-primary" : "border-muted-foreground", // basic radio style
                                        resolveIndicatorStyle(option.index, isSelected)
                                    )}
                                    aria-hidden="true"
                                >
                                    {isSelected && <span className="size-2 rounded-full bg-white" />}
                                </span>
                                <span className="flex-1">{option.content}</span>
                            </>
                        )}
                    </Button>
                )
            })}
        </div>
    )
}
