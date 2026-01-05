// Shared layer public exports

// UI Components (shadcn primitives)
export { Badge } from './ui/badge'
export { Button } from './ui/button'
export { Checkbox } from './ui/checkbox'
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
export { Input } from './ui/input'
export { Label } from './ui/label'
export { Separator } from './ui/separator'
export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from './ui/breadcrumb'

// Custom Reusable Components
export * as components from './components'

// Hooks
// Note: Import hooks from '@/shared/hooks' instead of '@/shared' to use in client components
export { useLocalStorage } from './hooks/use-local-storage'

// Utils
export { cn } from './utils/cn'
export * from './utils/time'
export * from './utils/question'

// Constants
export * from './constants'

