import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Button from './Button'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  pageSize = 20
}) => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <p className="text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * pageSize + 1, total)}-{Math.min(currentPage * pageSize, total)} of {total}
      </p>
      <nav className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FiChevronLeft size={16} />
        </Button>

        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 text-sm rounded-lg hover:bg-gray-100"
            >
              1
            </button>
            {start > 2 && <span className="px-2 text-gray-400">…</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-gray-400">…</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 text-sm rounded-lg hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <FiChevronRight size={16} />
        </button>
      </nav>
    </div>
  )
}

export default Pagination
