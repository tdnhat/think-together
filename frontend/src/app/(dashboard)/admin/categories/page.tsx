'use client'

import { CategoryList } from '@/features/category'

export default function CategoriesAdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Quản Lý Danh Mục
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Tạo, cập nhật, và quản lý các danh mục chủ đề cho quiz.
        </p>
      </div>

      {/* Category Management */}
      <CategoryList />
    </div>
  )
}

