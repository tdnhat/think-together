import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination"

interface PaginationControlsProps {
  readonly page: number
  readonly pageSize: number
  readonly total: number
  readonly onPageChange?: (page: number) => void
}

export function PaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (totalPages <= 1) {
    return null
  }

  const handleChange = (nextPage: number) => {
    if (!onPageChange) return
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
    onPageChange(nextPage)
  }

  const createPageArray = () => {
    const pages: (number | "...")[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i)
      }
      return pages
    }

    pages.push(1)

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    if (start > 2) {
      pages.push("...")
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push("...")
    }

    pages.push(totalPages)

    return pages
  }

  const pages = createPageArray()

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault()
              handleChange(page - 1)
            }}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages.map((p, index) => {
          if (p === "...") {
            return (
              <PaginationItem key={`ellipsis-${index.toString()}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          const pageNumber = p as number

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === page}
                onClick={(event) => {
                  event.preventDefault()
                  handleChange(pageNumber)
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault()
              handleChange(page + 1)
            }}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}


