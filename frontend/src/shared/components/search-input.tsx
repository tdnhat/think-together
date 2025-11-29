import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  iconColor?: string
}

/**
 * Search input with integrated search icon
 * Handles icon positioning automatically
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className,
  iconColor = 'text-[var(--text-secondary)]',
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className={cn('absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', iconColor)} />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
