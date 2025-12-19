'use client'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { CategoryDto } from '@/types/api'
import { Trash2, Edit2 } from 'lucide-react'

interface CategoryCardProps {
  category: CategoryDto
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <Badge variant={category.isActive ? 'default' : 'secondary'}>
              {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
          </div>
          {category.description && (
            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
          )}
          <p className="text-xs text-gray-500">
            Thứ tự: {category.displayOrder}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(category.id)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(category.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

