'use client'

import { useState } from 'react'
import { useCategories } from '../hooks/use-categories'
import { CategoryModal } from './category-modal'
import { CategoryCard } from './category-card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Plus } from 'lucide-react'
import type { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'

export function CategoryList() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory, isCreating, isUpdating, isDeleting } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Only show loading on initial load (when we have no data yet)
  // This prevents showing loading screen when refetching after mutations
  if (isLoading && categories.length === 0) return <div className="text-center py-8">Đang tải...</div>

  const handleCreateNew = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const handleEdit = (category: CategoryDto) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const handleDelete = async (category: CategoryDto) => {
    try {
      await deleteCategory(category.id)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const handleSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory && 'id' in data) {
      await updateCategory(data as UpdateCategoryRequest)
    } else {
      await createCategory(data as CreateCategoryRequest)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Danh Mục</h2>
          <p className="text-gray-500 text-sm">Tổng cộng: {categories.length} danh mục</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Danh Mục
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy danh mục nào
          </div>
        ) : (
          filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={editingCategory}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  )
}

