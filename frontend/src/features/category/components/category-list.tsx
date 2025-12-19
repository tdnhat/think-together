'use client'

import { useState } from 'react'
import { useCategories } from '../hooks/use-categories'
import { CategoryForm } from './category-form'
import { CategoryCard } from './category-card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Card } from '@/shared/ui/card'
import { Plus } from 'lucide-react'

export function CategoryList() {
  const { categories, isLoading, deleteCategory, isDeleting } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return <div className="text-center py-8">Đang tải...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Danh Mục</h2>
          <p className="text-gray-500 text-sm">Tổng cộng: {categories.length} danh mục</p>
        </div>
        <Button onClick={() => {
          setEditingId(null)
          setShowForm(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Danh Mục
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <CategoryForm
            categoryId={editingId}
            onSuccess={() => {
              setShowForm(false)
              setEditingId(null)
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
            }}
          />
        </Card>
      )}

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
              onEdit={(id) => {
                setEditingId(id)
                setShowForm(true)
              }}
              onDelete={(id) => deleteCategory(id)}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>
    </div>
  )
}

