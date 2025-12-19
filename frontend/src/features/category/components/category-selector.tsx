'use client'

import { useCategories } from '../hooks/use-categories'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

interface CategorySelectorProps {
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
}

export function CategorySelector({
  value,
  onChange,
  placeholder = 'Chọn danh mục',
}: CategorySelectorProps) {
  const { categories, isLoading } = useCategories()

  return (
    <Select value={value || ''} onValueChange={(val) => onChange(val || undefined)}>
      <SelectTrigger disabled={isLoading}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Không có danh mục</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

