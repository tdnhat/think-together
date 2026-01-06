'use client'

import { FolderTree, Plus, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CategoryModal, useCategories } from '@/features/category'
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'
import { DashboardLayout } from '@/widgets/dashboard'
import { PageHeader, PageContainer, ContentCard, FilterBar, EmptyState, DataTable } from '@/shared/components/page'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

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
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          icon={FolderTree}
          title="Quản Lý Danh Mục"
          description="Tạo, cập nhật, và quản lý các danh mục chủ đề cho quiz."
        />

        <ContentCard
          title="Danh Sách Danh Mục"
          description="Xem và quản lý tất cả danh mục trong hệ thống"
        >
          <FilterBar
            searchPlaceholder="Tìm kiếm danh mục..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            action={{
              label: "Thêm Danh Mục",
              onClick: handleCreateNew,
              icon: <Plus className="mr-2 h-4 w-4" />
            }}
          />

          <DataTable
            data={filteredCategories}
            columns={[
              {
                key: 'name',
                header: 'Tên danh mục',
                cell: (category) => (
                  <span className="font-medium">{category.name}</span>
                ),
              },
              {
                key: 'description',
                header: 'Mô tả',
                cell: (category) => category.description,
              },
              {
                key: 'status',
                header: 'Trạng thái',
                cell: (category) => (
                  <Badge variant={category.isActive ? 'default' : 'secondary'}>
                    {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                ),
                headerClassName: 'w-[150px] text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'actions',
                header: 'Hành động',
                cell: (category) => (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Sửa</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(category)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Xóa</span>
                    </Button>
                  </div>
                ),
                headerClassName: 'text-right',
                cellClassName: 'text-right',
              },
            ]}
            getRowKey={(category) => category.id}
            isLoading={isLoading}
            emptyState={
              searchTerm === '' ? (
                <EmptyState
                  icon={FolderTree}
                  title="Chưa có danh mục nào"
                  description="Bắt đầu bằng cách tạo danh mục đầu tiên để tổ chức quiz của bạn"
                  action={{
                    label: "Thêm Danh Mục",
                    onClick: handleCreateNew
                  }}
                />
              ) : (
                <EmptyState
                  icon={FolderTree}
                  title="Không tìm thấy kết quả"
                  description={`Không tìm thấy danh mục nào phù hợp với "${searchTerm}"`}
                />
              )
            }
          />
        </ContentCard>

        {/* Category Modal */}
        <CategoryModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          category={editingCategory}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      </PageContainer>
    </DashboardLayout>
  )
}
