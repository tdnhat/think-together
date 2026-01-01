'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { CategoryList, CategoryFilters, CategoryModal, useCategories } from '@/features/category'
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'

export default function CategoriesAdminPage() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory, isCreating, isUpdating, isDeleting } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Client-side filtering (since API doesn't support search yet)
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateNew = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const handleEdit = (category: CategoryDto) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const handleDelete = async (category: CategoryDto) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await deleteCategory(category.id)
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory && 'id' in data) {
      await updateCategory(data as UpdateCategoryRequest)
    } else {
      await createCategory(data as CreateCategoryRequest)
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Quản Lý Danh Mục
        </h1>
        <p className="text-muted-foreground mt-2">
          Tạo, cập nhật, và quản lý các danh mục chủ đề cho quiz.
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Danh Mục</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả danh mục trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CategoryFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCreateClick={handleCreateNew}
          />

          <CategoryList
            categories={filteredCategories}
            isLoading={isLoading}
            isDeleting={isDeleting}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

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

