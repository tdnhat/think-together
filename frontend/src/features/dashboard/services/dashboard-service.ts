import { api } from '@/lib/api/client'
import { DashboardChartsDto, DashboardCountsDto, QuizSetDto } from '@/types/api'

export const dashboardService = {
    getCounts: async () => {
        return api.get<DashboardCountsDto>('/api/admin/dashboard/counts')
    },
    getCharts: async () => {
        return api.get<DashboardChartsDto>('/api/admin/dashboard/charts')
    },
    getRecentActivity: async () => {
        return api.get<QuizSetDto[]>('/api/admin/dashboard/recent')
    },
}
