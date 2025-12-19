import { create } from 'zustand'
import { CategoryDto } from '@/types/api'

interface CategoryStore {
  selectedCategoryId: string | null
  categories: CategoryDto[]
  
  setSelectedCategory: (id: string | null) => void
  setCategories: (categories: CategoryDto[]) => void
  addCategory: (category: CategoryDto) => void
  updateCategory: (id: string, category: Partial<CategoryDto>) => void
  removeCategory: (id: string) => void
  reset: () => void
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategoryId: null,
  categories: [],

  setSelectedCategory: (id) =>
    set({ selectedCategoryId: id }),

  setCategories: (categories) =>
    set({ categories }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category]
    })),

  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      )
    })),

  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id)
    })),

  reset: () =>
    set({
      selectedCategoryId: null,
      categories: []
    })
}))

