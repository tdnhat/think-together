import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export interface UrlParamsConfig<T extends string = string> {
    defaultPageSize?: number
    defaultSortBy?: T
    defaultFilterBy?: string
}

export interface ParsedUrlParams<T extends string = string> {
    search: string
    sortBy: T
    filterBy: string
    page: number
    pageSize: number
}

export function useUrlParams<T extends string = string>({
    defaultPageSize = 50,
    defaultSortBy,
    defaultFilterBy = 'all'
}: UrlParamsConfig<T> = {}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const params: ParsedUrlParams<T> = useMemo(() => {
        const search = searchParams.get('search') || ''
        const sortBy = (searchParams.get('sortBy') as T) || defaultSortBy
        const filterBy = searchParams.get('filterBy') || defaultFilterBy
        const page = Number.parseInt(searchParams.get('page') || '1', 10)
        const pageSize = Number.parseInt(
            searchParams.get('pageSize') || defaultPageSize.toString(),
            10
        )

        return {
            search,
            sortBy: sortBy as T,
            filterBy,
            page,
            pageSize,
        }
    }, [searchParams, defaultPageSize, defaultSortBy, defaultFilterBy])

    const updateParams = (updates: Partial<ParsedUrlParams<T>>) => {
        const newParams = new URLSearchParams(searchParams.toString())

        if (updates.search !== undefined) {
            if (updates.search) {
                newParams.set('search', updates.search)
            } else {
                newParams.delete('search')
            }
        }

        if (updates.sortBy && updates.sortBy !== defaultSortBy) {
            newParams.set('sortBy', updates.sortBy)
        } else if (updates.sortBy === defaultSortBy) {
            newParams.delete('sortBy')
        }

        if (updates.filterBy && updates.filterBy !== defaultFilterBy) {
            newParams.set('filterBy', updates.filterBy)
        } else if (updates.filterBy === defaultFilterBy) {
            newParams.delete('filterBy')
        }

        if (updates.page && updates.page > 1) {
            newParams.set('page', updates.page.toString())
        } else {
            newParams.delete('page')
        }

        if (updates.pageSize && updates.pageSize !== defaultPageSize) {
            newParams.set('pageSize', updates.pageSize.toString())
        } else {
            newParams.delete('pageSize')
        }

        // Use router.push but preserve scroll position if needed (can be customized)
        router.push(`?${newParams.toString()}`)
    }

    return {
        params,
        updateParams,
        searchParams
    }
}
